// export const onSellerLoginSubmit = async (credentials) => {
//     try {
//         const response = await sellerLogin(credentials);
//         localStorage.setItem("token", response.token)
//         dispatch(loginSuccess({
//             user: response.user,
//             token: response.token,
//             role: "seller",
//         }));
//         navigate('/admin');

//     } catch (error) {
//         dispatch(loginFailure(error.message));
//     }
// };