---
slug: hi-redux-2
title: Hi! redux-2
tags: [redux, state manage]
# authors: [bofenghsiao]
---

上一篇我們提到使用 redux 的情境, 也提到 middleware 的概念, 這次會講解

- `redux-thunk`, `createAsyncThunk` 在非同步情境下的使用
- `RTK Query` 另一種 state manage (狀態管理)的觀點。

<!--truncate-->

## Handle async logic and side effect

在 redux 中由於 action 必須是純物件, 因此如果有非同步邏輯, 需要先在函式中處理完再發送 action

```jsx
import { useDispatch } from 'redux-toolkit'
import { updatePost } from './postSlice'

function Component(props) {
  const dispatch = useDispatch()

  const hadnleGetPost = (postId) => {
    try {
      const response = await getPost(postId);
      // action must be pure object
      dispatch(updatePost(response.data));
    } catch (err) {
      // handle error
    }
  }

  return(
    <div>
      <button onClick={hadnleGetPost("1")}>get post</button>;
      {/* ... */}
    </div>
  )
}
```

### redux-thunk

> middlewares 加入 redux-thunk 後, action 可以是 function, 非同步的邏輯也能寫在函式內

如果 `action` 為函式(function), 將 `dispatch`, `getState` 兩個參數傳給 action, 讓函式能夠操作 dispatch 和 getState(取得 store 的狀態)

```js
const thunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === "function") {
    return action(store.dispatch, store.getState);
  }

  // 否則將 action 交給下一個 middleware
  return next(action);
};
```

#### 撰寫 thunk

redux-toolkit 預設已提供這個 middleware, 因此不需額外安裝

```js
// action is function, not pure object
export const fetchPostThunk = (postId) => async (dispatch, getState) => {
  try {
    // handle async logic
    const response = await fetchPost(postId);
    dispatch(updatePost(response.data));
  } catch (err) {
    // handle error
  }
};
```

```jsx
import { fetchPostThunk } from "./postSlice";

function Component(props) {
  const dispatch = useDispatch();

  const hadnleGetPost = (postId) => {
    dispatch(fetchPostThunk(postId));
  };

  return (
    <div>
      <button onClick={hadnleGetPost("1")}>get post</button>;{/* ... */}
    </div>
  );
}
```

用 thunk 處理非同步請求的狀態(pending, fulfilled, rejected)

```jsx
const postSlice = () =>
  createSlice({
    name: "post",
    initialState,
    reducers: {
      getPostStart: (state, action) => {
        state.status = "loading";
      },
      getPostSuccess: (state, action) => {
        state.status = "idle";
        state.posts = action.payload;
      },
      getPostFailed: (state, action) => {
        state.status = "failed";
      },
    },
  });

// 依 promise status 來更新狀態
const fetchPostThunk = (postId) => async (dispatch, getState) => {
  // handle loading
  dispatch(getPostStart());
  try {
    const res = await getPost(postId);
    // handle response success
    dispatch(getPostSuccess(res.data));
  } catch (err) {
    // handle response failed
    dispatch(getPostFailed());
  }
};

// 將非同步邏輯封裝至 thunk, 元件中直接使用
dispatch(fetchPostThunk("1"));
```

實際開發很常重複撰寫上面的 pattern, 而 `redux-toolkit` 提供了 `createAsyncThunk` API 以另一種方式撰寫, 讓我們來看看吧!

### createAsyncThunk

1. 依據 `promise` 狀態(pending, fulfilled, rejected)幫我們 create action, dispatch action
2. return 值會成為 promise fulfilled 的 action payload

```jsx
// 第一個參數是 action type, 第二個參數是 API callback(回傳 promise)
export const fetchPostById = createAsyncThunk(
  "posts/fetchPosts",
  async (postId, thunkAPI) => {
    const res = await getPost(postId);
    return res.data;
  }
);

// 元件中直接使用
dispatch(fetchPostById("1"));
```

不需要在 reducers 中建立 actions, 而是使用 `extraReducers` 依 promise (pending, fulfilled, rejected)來更新狀態, 讓 thunk 的邏輯分離的更加清晰, 也減少許多重複的邏輯

```jsx
const postSlice = () =>
  createSlice({
    name: "post",
    initialState,
    reducers: {
      // no logic in reducers
    },
    // 能依 promise status 更新狀態
    extraReducers: (builder) => {
      builder
        // handle promise pending
        .addCase(fetchPostById.pending, (state, action) => {
          state.staus = "loading";
        })
        // handle promise fulfilled
        .addCase(fetchPostById.fulfilled, (state, action) => {
          state.staus = "idle";
          state.post = action.payload;
        })
        // handle promise rejected
        .addCase(fetchPostById.rejected, (state, action) => {
          state.staus = "failed";
        });
    },
  });
```

## RTK Query

`RTK Query` 是 `redux-toolkit` 內容篇幅較大較重要的部分, 從另一種狀態管理觀點來看前端如何 **fetch data**, **和 server 溝通**

#### 主要用途

1. Manage the lifetime 不需重複撰寫生命週期的邏輯
2. Dedupe 避免重複發送相同請求(不必要的請求)
3. Cache data 並可依據條件重新獲取資料
4. Endpoint 讓專案能夠集中整合撰寫 api
5. Redux DevTools 資源整合

開始前, 需要先用 createApi 在專案中建立一個集中管理 api endpoint 的地方, 建立完後 RTK Query 會自動產生相對應的 hook 供開發者使用, 命名規則為 "use" + "endpoint name" + "Query" 或 "Mutation"

```js
const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
  }),
  endpoints: (build) => ({
    // highlight-start
    getPosts: build.query({
      query: () => "/posts",
    }),
    addPost: build.mutation({
      query: (body) => ({
        url: "post",
        method: "POST",
        body,
      }),
    }),
    // highlight-end
  }),
});

// auto-generate hooks
export const { useGetPostsQuery, useAddPostMutation } = api;
```

### Store data into Client State

以單純 React 開發的網站來舉例, 如何跟後端拿資料後顯示在畫面上

1. 頁面或元件 onMount 之後和 server 端要資料
2. server 回傳 response
3. 前端將 response 存進前端狀態
4. UI 顯示前端狀態
5. 後續和 server 來往時, 將 response 再次寫進(更新)前端狀態
6. UI 顯示最新的前端狀態

```jsx
function Component(props) {
  // client state
  const [posts, setPosts] = useState(null);

  // update client state after server response
  const handleAddPost = () => {
    updatePosts({ postId, title, content })
      .then(res => res.json())
      .then(data => setPosts([...posts, data]))
  }

  // fetch data when component onMount, then store server response into client state
  useEffect(() => {
    fetchPosts()
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    // render UI
  )
}
```

**前端用 useState 保管的資料(狀態)稱為 `client state`, 從後端回來的資料(狀態)稱為 `server state`**

在這個情境下, 前端為了將 server state 顯示在畫面上, 因此做了這件事:

1. 把後端來的資料(server state) clone 一份, 然後存到前端狀態(client state)
2. 後續只要有跟 server 互動, 我再拿 response 修改前端的狀態, 讓畫面上顯示的資料和後端一樣

做這段的目的是為了將呈現 server state 呈現在畫面上, 所以...

> 只要有一個辦法記住 server state 並且當狀態改變時更新他的話, 前端就不用複製一份 server 狀態自行做更新

### Cache And Sync Server State

#### `Cache and Dedupe`

1. 前端從 server 拿到 response data
2. RTK Query **將 data 存到 redux store 中當作 cache**
3. 對同一份資料進行額外的 request 時，**如 cache 存在就使用 cache data 不會再次發送 request**
4. cache 過期後會重新發 request, 並將 response data 再存進 cache

接下來先替換掉原先元件中的 useEffect, useState, 改成 useQuery hook

```jsx
function Component() {
    // highlight-start
    // data will be cache into redux store
    const { data, isLoading, isError } = useGetPostsQuery();
    // highlight-end

    // 先暫時忽略, 下一步會替換掉這段
    const handleAddPost = () => {
      updatePosts({ postId, title, content })
        .then(res => res.json())
        .then(data => setPosts([...posts, data]))
    }

    return (
      // render UI
    );
}
```

cache data 還存在的情況下

1. 元件重新渲染也不會再次發送 request
2. 多個元件對同一份資料進行 request 時, 優先使用 cache, 避免多餘的請求
3. 能夠從 redux-store 依據 api endpoint 取得 cache data

這樣我們就能保存一份 server state 在前端, 但 server state 改變時, 還需要另一個機制讓這份 cache 能夠被更新, 不然我們的畫面會呈現舊資料而不是最新的資料

到這裡有一個很重要的概念

> 我們不再自行管理 client state, 只關注同步 server state 的時機點

#### `Automated Re-fetching`

什麼時候要重新同步 server state ?

1. 定時去撈 (interval)
2. 特定動作觸發去拿 (event trigger)
3. **server 狀態改變後立即去拿 (subscribe)**

在這邊先討論第三個情境, 成功新增一筆貼文後, 畫面上要呈現 server 最新的狀態

在之前的 createApi 中有 `tagTypes` 這個選項, 加上 `['Post']` 標籤後, 同時在 endpoint getPosts 加上 providesTags `['Post']` , addPost 加上 invalidatesTags `['Post']`

這樣一來, 呼叫 addPost 完成後 `['Post']` 就會失效, 而 getPosts 會自動重新發送新的請求(refetch)取得 server 最新的狀態

```js
const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  }),
  // highlight-start
  tagTypes: ['Post'],
  // highlight-end
  endpoints: (build) => ({
    getPosts: build.query<Post[], void>({
      query: () => '/posts',
      // highlight-start
      providesTags: ['Post'],
      // highlight-end
    }),
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query: (body) => ({
        url: 'post',
        method: 'POST',
        body,
      }),
      // highlight-start
      invalidatesTags: ['Post'],
      // highlight-end
    }),
  }),
})
```

替換掉元件中的 updatePosts, 使用 useAddNewPostMutation 提供的 addNewPost trigger

```jsx
function Component() {
    const { data, isLoading, isSuccess, isError } = useGetPostsQuery();
    // highlight-start
    // Mutation hooks return a "trigger" function that sends an update request, plus loading status
    const [addNewPost] = useAddNewPostMutation();
    // highlight-end

    const handleAddPost = () => {
      // highlight-start
      addNewPost({ postId, title, content })
      // highlight-end
    }

    return (
      // render UI
    );
}
```

原本執行 handleAddPost 後的邏輯是

1. 執行 updatePosts 更新 server state 同時等待 response
2. 把 response 放到原本的 posts 陣列裡面 (update client state)
3. 畫面上呈現新增的文章

換成 useAddNewPostMutation 後

1. 執行 addNewPost 更新 server state
2. 更新成功後, 自動重新呼叫 useGetPostsQuery 從 server 拿最新的資料回來
3. 畫面上呈現新增的文章

### 再次思考 state

如果需求是單純將 server state 呈現在畫面上, 這會是一個不錯的解決方案, 減少元件不必要的狀態和修改, lifetime, cache, refetch 等情境也有考慮到。

但並不代表要把所有的狀態都交給 RTK Query(或是 react-query) 管理, 像是登入會員, 購物車資訊等 server 沒有提供完整資料的部分, 還是需要將 response 存進 client state(redux-store)中。

:::note
`react-query` , `swr` , `rtk query` 等工具主要用來解決前端對 `server state` 以及 `data fetching`(cache, lifetime, refetch, dedupe) 等問題, 如本身沒使用像 next.js, remix 等框架幫你處理掉部分 data fetch issue 的話很適合使用。

如專案本身已使用 `next.js` 或類似的 framework, 能夠在 server 端回傳渲染好的 html, 降低不少純 react 需要解決的問題(onMount fetch, cache, loading 等), 可依實際需求決定要不要使用。
:::

## Reference

[reacting-to-input-with-state](https://react.dev/learn/reacting-to-input-with-state)

[You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

[Using Middleware to Enable Async Logic](https://redux.js.org/tutorials/essentials/part-5-async-logic#:~:text=the%20most%20common%20reason%20to%20use%20middleware%20is%20to%20allow%20different%20kinds%20of%20async%20logic%20to%20interact%20with%20the%20store.)

[What async middleware should I use? How do you decide between thunks, sagas, observables, or something else?](https://redux.js.org/faq/actions#what-async-middleware-should-i-use-how-do-you-decide-between-thunks-sagas-observables-or-something-else)

[Automatic Refreshing with Cache Invalidation](https://redux.js.org/tutorials/essentials/part-7-rtk-query-basics#automatic-refreshing-with-cache-invalidation)
