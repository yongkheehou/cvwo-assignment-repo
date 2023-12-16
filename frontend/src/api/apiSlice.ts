import { BaseQueryApi, BaseQueryFn, FetchBaseQueryError, createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../features/auth/authSlice'
import { RootState } from '../store'

const baseQuery: BaseQueryFn = fetchBaseQuery({
    baseUrl: 'http://localhost:3500',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState
        const token = state.auth.token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

const baseQueryWithReauth = async (args: any, api: BaseQueryApi, extraOptions: object) => {
    let result = await baseQuery(args, api, extraOptions)
    const state = api.getState() as RootState

    if (result?.error) {
      const err = result.error as FetchBaseQueryError
      if ("originalStatus" in err) {
        if (err?.originalStatus === 403) {
          console.log('sending refresh token')
          // send refresh token to get new access token 
          const refreshResult = await baseQuery('/refresh', api, extraOptions)
          console.log(refreshResult)
          if (refreshResult?.data) {
            const user = state.auth.user
            // store the new token 
            api.dispatch(setCredentials({ ...refreshResult.data, user }))
            // retry the original query with new access token 
            result = await baseQuery(args, api, extraOptions)
          } else {
            api.dispatch(logOut(state))
          }
        }
      }
    }

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})
