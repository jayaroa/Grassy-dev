import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Profile = React.lazy(() => import('./views/UtilityPages/Profile'));
const PushMessage = React.lazy(() => import('./views/UtilityPages/PushMessage'));
const ParkList = React.lazy(() => import('./views/UtilityPages/ParkList'));
const Contests = React.lazy(() => import('./views/UtilityPages/Contests'));
const PictureContests = React.lazy(() => import('./views/UtilityPages/PictureContests'));
const ParkDetails = React.lazy(() => import('./views/UtilityPages/ParkDetails'));
const ContestDetails = React.lazy(() => import('./views/UtilityPages/ContestDetails'));
const Package = React.lazy(() => import("./views/Pages/Package"));
const PictureContestDetails = React.lazy(() => import('./views/UtilityPages/PictureContestDetails'));
const PushNotifications = React.lazy(() => import('./views/UtilityPages/PushNotification'))



const routes = [
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/profile', exact: true, name: 'Profile', component: Profile },
  { path: '/pushmessage', exact: true, name: 'Push Message', component: PushMessage },
  { path: '/parklist', exact: true, name: 'Park List', component: ParkList },
  { path: '/contests', exact: true, name: 'Check-in Contests', component: Contests },
  { path: '/picturecontests', exact: true, name: 'Picture Contests', component: PictureContests },
  { path: '/parklist/parkdetails/:id', exact: true, name: 'Park Details', component: ParkDetails },
  { path: '/contests/contestdetails/:id', exact: true, name: 'Contest Details', component: ContestDetails },
  { path: '/picturecontests/picturecontestdetails/:id', exact: true, name: 'Picture Contest Details', component: PictureContestDetails },
  { path: '/pushNotifications', exact: true, name: 'Push Notifications', component: PushNotifications }
];


export default routes;
