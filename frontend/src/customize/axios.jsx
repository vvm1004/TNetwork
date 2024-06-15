import axios from 'axios'

const instance = axios.create();
let isRefreshing = false; // Biến để đánh dấu xem có đang thực hiện refresh token hay không
let refreshCallbacks = []; // Mảng lưu các callback để thực hiện lại request sau khi refreshToken thành công
const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};
const getAccessToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken ? JSON.parse(accessToken) : null;
};
const getRefreshToken = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    return refreshToken ? JSON.parse(refreshToken) : null;
};
// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (config.url === '/api/v1/users/login'
        || config.url === '/api/v1/handleRefreshToken'
        || config.url === '/api/v1/users/signup'
        || config.url === '/api/v1/users/logout'
    ) {
        return config;
    }
    const accessToken = getAccessToken();
    config.headers['x-accesstoken'] = accessToken;
    return config;

}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(async function (response) {
    const config = response.config;
    // console.log('Sau khi server response::', response.data)
    if (config.url === '/api/v1/users/login'
        || config.url === '/api/v1/handleRefreshToken'
        || config.url === '/api/v1/users/signup'
        || config.url === '/api/v1/users/logout'
    ) {
        // Các routes không cần check token
        return response;
    }
    const { code, msg } = response.data;
    if (code && code === 401) {
        if (msg && msg === 'jwt expired') {
            if (!isRefreshing) {
                console.log("Trường hợp token hết hạn:::", msg)
                isRefreshing = true;
                try {
                    const currentUser = getCurrentUser();
                    const refreshToken = getRefreshToken()

                    const refreshTokenResponse = await axios.post('/api/v1/handleRefreshToken', null, {
                        headers: {
                            "x-client-id": currentUser?._id,
                            "x-rtoken-id": refreshToken,
                        },
                    });

                    const newUser = refreshTokenResponse.data;
                    const newAccesstoken = refreshTokenResponse.data.tokens.accessToken;
                    const newRefreshToken = refreshTokenResponse.data.tokens.refreshToken;

                    console.log("New user    ", newUser)
                    localStorage.setItem('user', JSON.stringify(newUser));
                    localStorage.setItem('accessToken', JSON.stringify(newAccesstoken));
                    localStorage.setItem('refreshToken', JSON.stringify(newRefreshToken));

                    config.headers['x-accesstoken'] = newAccesstoken;

                    // Thiết lập lại isRefreshing sau khi refresh token thành công
                    isRefreshing = false;

                    // Thực hiện lại request gốc với token mới
                    return instance(config);
                } catch (refreshError) {
                    isRefreshing = false;
                    return Promise.reject(refreshError);
                }
            } else {
                // Nếu đang refreshing, đợi và thử lại sau khi refreshToken thành công
                return new Promise(resolve => {
                    // Thêm hàm callback vào mảng để gọi lại request sau khi refreshToken thành công
                    refreshCallbacks.push(() => {
                        resolve(instance(config));
                    });
                });
            }
        }
    }
    return response;
}, function (error) {
    return Promise.reject(error);
});


export default instance;
