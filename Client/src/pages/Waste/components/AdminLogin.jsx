// export const onAdminLoginSubmit = async (credentials) => {
//     try {
//         const response = await adminLogin(credentials);
//         localStorage.setItem("token", response.token)
//         dispatch(loginSuccess({
//             user: response.user,
//             token: response.token,
//             role: "admin",
//         }));
//         navigate('/admin');

//     } catch (error) {
//         dispatch(loginFailure(error.message));
//     }
// };

