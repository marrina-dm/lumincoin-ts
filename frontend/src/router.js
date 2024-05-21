import {CommonUtils} from "./utils/common-utils";
import {Dashboard} from "./components/dashboard";
import {FileUtils} from "./utils/file-utils";
import {Login} from "./components/auth/login";
import {Signup} from "./components/auth/signup";
import {Logout} from "./components/auth/logout";

export class Router {
    routes = null;
    titlePageElement = null;
    contentPageElement = null;

    constructor() {
        this.titlePageElement = document.getElementById('page-title');
        this.contentPageElement = document.getElementById('content');
        this.initEvents();

        this.routes = [
            {
                route: '/',
                title: 'Главная',
                template: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard();
                },
                scripts: [
                    'chart.umd.js'
                ]
            },
            {
                route: '/login',
                title: 'Авторизация',
                template: '/templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    new Login(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/sign-up',
                title: 'Регистрация',
                template: '/templates/pages/auth/sign-up.html',
                useLayout: false,
                load: () => {
                    new Signup(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income',
                title: 'Доходы',
                template: '/templates/pages/income/list.html',
                useLayout: '/templates/layout.html'
            },
            {
                route: '/income/create',
                title: 'Создание категории доходов',
                template: '/templates/pages/income/create.html',
                useLayout: '/templates/layout.html'
            },
            {
                route: '/income/edit',
                title: 'Редактирование категории доходов',
                template: '/templates/pages/income/edit.html',
                useLayout: '/templates/layout.html'
            },
            {
                route: '/expense',
                title: 'Расходы',
                template: '/templates/pages/expense/list.html',
                useLayout: '/templates/layout.html'
            },
            {
                route: '/expense/create',
                title: 'Создание категории расходов',
                template: '/templates/pages/expense/create.html',
                useLayout: '/templates/layout.html'
            },
            {
                route: '/expense/edit',
                title: 'Редактирование категории расходов',
                template: '/templates/pages/expense/edit.html',
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                template: '/templates/pages/operations/list.html',
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations/create',
                title: 'Доходы и расходы',
                template: '/templates/pages/operations/create.html',
                useLayout: '/templates/layout.html'
            },
            {
                route: '/operations/edit',
                title: 'Доходы и расходы',
                template: '/templates/pages/operations/edit.html',
                useLayout: '/templates/layout.html'
            }
        ];
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else if (e.target.parentNode.nodeName === 'A') {
            element = e.target.parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');

            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState(null, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async activateRoute(e, oldRoute) {
        if (oldRoute) {
            const currentRoute = this.routes.find((route) => route.route === oldRoute);
            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach((script) => {
                    document.querySelector(`script[src='/js/${script}']`).remove();
                });
            }

            if (document.body.getAttribute('style')) {
                document.body.removeAttribute('style');
            }
        }

        const urlRoute = window.location.pathname;
        const newRoute = this.routes.find((route) => route.route === urlRoute);

        if (newRoute) {
            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.title) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.template) {
                let contentBlock = this.contentPageElement;
                if (newRoute.useLayout) {
                    this.contentPageElement.innerHTML = await fetch(newRoute.useLayout).then(response => response.text());
                    contentBlock = document.getElementById("content-layout");

                    this.activateMenuItem(newRoute);
                }
                contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
        }
    }

    activateMenuItem(route) {
        const categoryElement = document.getElementById('category');
        const categoryCollapse = document.getElementById("category-collapse");
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                if (item.classList.contains('sub-category')) {
                    categoryElement.classList.remove('collapsed');
                    categoryElement.classList.add('rounded-bottom-0');
                    categoryElement.getAttribute('aria-expanded', 'true');
                    categoryCollapse.classList.add('show');
                    CommonUtils.activateLink(categoryElement);
                }
                CommonUtils.activateLink(item);
            } else {
                CommonUtils.unactivateLink(item);
            }
        });

        categoryElement.addEventListener('click', (e) => {
            if (e.target.classList.contains('collapsed')) {
                CommonUtils.unactivateLink(e.target);
            } else {
                CommonUtils.activateLink(e.target);
            }
            e.target.classList.toggle('rounded-bottom-0');
        });
    }
}