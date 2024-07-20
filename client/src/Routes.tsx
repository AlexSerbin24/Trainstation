import React, { useEffect, useState } from 'react';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Root from './Root.tsx';
import MainPage from './pages/main/MainPage.tsx';
import LoginPage from './pages/account/forms/login/LoginPage.tsx';
import RegistrationPage from './pages/account/forms/register/RegistrationPage.tsx';
import PersonalPage from './pages/account/personal/PersonalPage.tsx';
import BookingsPage from './pages/account/bookings/BookingsPage.tsx';
import TicketingPage from './pages/ticketing/TicketingPage.tsx';
import TrainService from './services/TrainService.ts';
import TrainPage from './pages/trains/TrainsPage.tsx';
import ChatPage from './pages/chat/ChatPage.tsx';
import { ProtectedRoute } from './components/protectedRoute/protectedRoutes.tsx';
import User, { UserContextType } from './types/userContext.ts';
import useUser from './hooks/useUser.ts';
import TicketService from './services/TicketService.ts';
import AuthService from './services/AuthService.ts';
import CartService from './services/CartService.ts';
import { useCart } from './hooks/useCart.ts';
import PrivateAuthService from './services/PrivateAuth.ts';
import AdminService from './services/AdminService.ts';
import PanelPage from './pages/admin/panel/PanelPage.tsx';
import CreateOrUpdateTrain from './pages/admin/createOrUpdateTrain/CreateOrUpdateTrainPage.tsx';




export default function Routes() {
  const { setCart } = useCart();
  const userValue = useUser();

  useEffect(() => {
    AuthService.refresh()
      .then(data => {
        if (data)
          (userValue as UserContextType).setUser(data)
      })
      .catch(error => console.log("User is not authorized"));


  }, []);


  useEffect(() => {
    if (userValue && userValue.user) CartService.getCart(userValue.user.id);
    else if (userValue && !userValue.user) setCart([]);
  }, [userValue])



  const publicRoutes = [
    {
      path: "/",
      loader: async () => {
        try {
          return await TrainService.getStations();
        } catch (error) {
          return null;
        }
      },
      element: <MainPage />
    },
    {
      path: "trains",
      loader: async ({ request }) => {
        const url = new URL(request.url);
        const departurePoint = url.searchParams.get("departurePoint") as string;
        const arrivalPoint = url.searchParams.get("arrivalPoint") as string;
        const departureDate = url.searchParams.get("departureDate") as string;
        const isRoundTrip = url.searchParams.get("isRoundTrip") === "true" ? true : false;

        const trains = await TrainService.searchTrains({ departurePoint, arrivalPoint, departureDate, isRoundTrip });

        return trains;
      },
      element: <TrainPage />
    },
    {
      path: "/account",
      children: [
        {
          path: "login",
          element: <LoginPage />
        },
        {
          path: "registration",
          element: <RegistrationPage />
        }
      ]
    },
    {
      path: "/admin",
      children: [
        {
          path: "",
          loader: async ({ request }) => {
            const trains = await AdminService.getTrains();
            const stations = await TrainService.getStations();

            return { trains, stations };
          },
          element: <PanelPage />
        },
        {
          path:"create",
          loader: async ({ request }) => {
            const stations = await TrainService.getStations();
            return {stations}
          },
          element:<CreateOrUpdateTrain isEditMode={false}/>
        },
        {
          path:"edit/:id",
          loader: async ({ params }) => {
            const stations = await TrainService.getStations();
            const trainDataForUpdate = await AdminService.getTrainForUpdate(params.id)
            return {stations, trainData:trainDataForUpdate}
          },
          element:<CreateOrUpdateTrain isEditMode={true}/>
        }
      ]
    }
  ];

  const privateRoutes = [
    {
      path: "/",
      element: <ProtectedRoute />,

      children: [
        {

          path: "chat",
          element: <ChatPage />
        },
        {
          path: "/ticketing/:id",
          loader: async ({ params, request }) => {
            const id = params.id;
            const url = new URL(request.url);
            const departurePoint = url.searchParams.get("departurePoint") as string;
            const arrivalPoint = url.searchParams.get("arrivalPoint") as string;


            return await TrainService.getTrainById(id, { departurePoint, arrivalPoint });

          },
          element: <TicketingPage />
        },
        {
          path: "/account",
          children: [{
            path: "/account/",
            loader: async () => {
              try {
                const user = (userValue as UserContextType).user as User;
                const userData = await PrivateAuthService.getProfile(user.id);
                return userData;
              } catch (error) {
                return null;
              }
            },
            element: <PersonalPage />
          },
          {
            path: "bookings",
            loader: async ({ params }) => {

              if (userValue && userValue.user) {
                return await TicketService.getTickets(userValue.user.id);
              }
              return null;
            },
            element: <BookingsPage />,
          }]
        },
        // {
        //   path: "/admin",
        //   children: [{
        //     path: "/admin/",
        //     loader: async () => {
        //       try {
        //         const trains = await AdminService.getTrains();
        //         return trains;
        //       } catch (error) {
        //         return null;
        //       }
        //     },
        //     element: <AdminPanelPage />
        //   },
        //   {
        //     path: "/admin/addTrain",
        //     loader: async () => {
        //       try {
        //         return await TrainService.getStations();
        //       } catch (error) {
        //         return null;
        //       }
        //     },
        //     element: <AddFlightPage />
        //   },
        //   {
        //     path: "/admin/updateFlight/:id",
        //     // loader: async ({ params }) => {
        //     //   return await TrainService.getFlihtById(params.id as string);
        //     // },
        //     element: <UpdateFlight />
        //   }]
        // }
      ]
    }
  ];

  const routes = [...publicRoutes, ...privateRoutes];

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
      children: routes
    }
  ]);

  return <RouterProvider router={router} />

}
