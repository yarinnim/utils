import { type RouteObject, createBrowserRouter } from 'react-router';
import { lazy, createElement as re, type ReactElement } from 'react';
import MainLayout from '@/layouts/MainLayout';

type Element = string | ReactElement;

const getPage = (page: string) => re(lazy(() => import(`../pages/${page}`)));

const createRoute = (path: string, page: Element, props: any = {}) => {
  const element = (typeof page === 'string') 
    ? getPage(page)
    : page;

  return { path, element, ...props };
};

const routes: RouteObject[] = [
  createRoute('/', 'Home'),
];

export default function createRoutes() {
  const baseRoutes: RouteObject[] = [
    {
      element: re(MainLayout),
      children: [
        ...routes,
        createRoute('/*', 'Error/NotFound'),
      ],
    },
  ];

  return createBrowserRouter(baseRoutes);
}
