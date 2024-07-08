// import { getCookie } from "cookies-next";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import { APP_ACCESSTOKEN } from "../config/auth.config";
// import { resetAllApiActions } from "../store/store";
// import { useAppDispatch } from "../store/hooks";
// import { Flex, Spin } from "antd";

// export const Auth = ({ children }: any) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const dispatch = useAppDispatch();

//   const router = useRouter();

//   useEffect(() => {
//     const accessToken = getCookie(APP_ACCESSTOKEN);
//     if (accessToken) {
//       router.push(`/dashboard`);
//       resetAllApiActions.map(dispatch);
//       setIsAuthenticated(true);
//     } else {
//       router.push(`/login`);
//     }
//   }, [dispatch, router]);
//   if (!isAuthenticated)
//     return (
//       <Flex vertical align="center" justify="center">
//         <Spin />
//       </Flex>
//     );
//   return children;
// };
// export default Auth;
