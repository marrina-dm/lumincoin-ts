import {CommonUtils} from "./utils/common-utils";
import {Dashboard} from "./components/dashboard";
import {FileUtils} from "./utils/file-utils";
import {Login} from "./components/auth/login";
import {Signup} from "./components/auth/signup";
import {Logout} from "./components/auth/logout";
import {AuthUtils} from "./utils/auth-utils";
import {Layout} from "./components/layout";
import {IncomeList} from "./components/income/income-list";
import {IncomeDelete} from "./components/income/income-delete";
import {IncomeCreate} from "./components/income/income-create";
import {IncomeEdit} from "./components/income/income-edit";
import {ExpenseList} from "./components/expense/expense-list";
import {ExpenseDelete} from "./components/expense/expense-delete";
import {ExpenseCreate} from "./components/expense/expense-create";
import {ExpenseEdit} from "./components/expense/expense-edit";
import {OperationsList} from "./components/operations/operations-list";
import {OperationsDelete} from "./components/operations/operations-delete";
import {OperationsEdit} from "./components/operations/operations-edit";
import {OperationsCreate} from "./components/operations/operations-create";
import {RouteType} from "./types/route.type";
import {UserInfoType} from "./types/auth.type";

export class Router {
    readonly routes: RouteType[];
    readonly titlePageElement: HTMLElement | null;
    readonly contentPageElement: HTMLElement | null;

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
                    new Dashboard(this.openNewRoute.bind(this));
                },
                scripts: [
                    'chart.umd.js'
                ],
                styles: [
                    'all.min.css'
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
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/create',
                title: 'Создание категории доходов',
                template: '/templates/pages/income/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/edit',
                title: 'Редактирование категории доходов',
                template: '/templates/pages/income/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new IncomeEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/income/delete',
                load: () => {
                    new IncomeDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense',
                title: 'Расходы',
                template: '/templates/pages/expense/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseList(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/create',
                title: 'Создание категории расходов',
                template: '/templates/pages/expense/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/edit',
                title: 'Редактирование категории расходов',
                template: '/templates/pages/expense/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new ExpenseEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/expense/delete',
                load: () => {
                    new ExpenseDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations',
                title: 'Доходы и расходы',
                template: '/templates/pages/operations/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsList(this.openNewRoute.bind(this));
                },
                styles: [
                    'all.min.css'
                ]
            },
            {
                route: '/operations/create',
                title: 'Доходы и расходы',
                template: '/templates/pages/operations/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsCreate(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/edit',
                title: 'Доходы и расходы',
                template: '/templates/pages/operations/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OperationsEdit(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/operations/delete',
                load: () => {
                    new OperationsDelete(this.openNewRoute.bind(this));
                }
            }
        ];
    }

    private initEvents(): void {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    private async clickHandler(e: Event): Promise<void> {
        let element = null;
        if ((e.target as HTMLElement).nodeName === 'A') {
            element = e.target;
        } else if ((e.target as HTMLElement).parentNode?.nodeName === 'A') {
            element = (e.target as HTMLElement).parentNode;
        }

        if (element) {
            e.preventDefault();

            const currentRoute: string = window.location.pathname;
            const url: string = (element as HTMLLinkElement).href.replace(window.location.origin, '');

            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    private async openNewRoute(url: string): Promise<void> {
        const currentRoute: string = window.location.pathname;
        history.pushState(null, '', url);
        await this.activateRoute(null, currentRoute);
    }

    private async activateRoute(e: Event | null ,oldRoute?: string): Promise<void> {
        if (oldRoute) {
            const currentRoute: RouteType | undefined = this.routes.find((route) => route.route === oldRoute);
            if (currentRoute) {
                if (currentRoute.styles && currentRoute.styles.length > 0) {
                    currentRoute.styles.forEach((style: string) => {
                        document.querySelector(`link[href='/css/${style}']`)?.remove();
                    });
                }

                if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                    currentRoute.scripts.forEach((script: string) => {
                        document.querySelector(`script[src='/js/${script}']`)?.remove();
                    });
                }
            }

            if (document.body.getAttribute('style')) {
                document.body.removeAttribute('style');
            }
        }

        const urlRoute: string = window.location.pathname;
        const newRoute: RouteType | undefined = this.routes.find((route: RouteType) => route.route === urlRoute);

        if (newRoute) {
            if (newRoute.styles && newRoute.styles.length > 0) {
                newRoute.styles.forEach((style: string) => {
                    FileUtils.loadPageStyle('/css/' + style);
                });
            }

            if (newRoute.scripts && newRoute.scripts.length > 0) {
                for (const script of newRoute.scripts) {
                    await FileUtils.loadPageScript('/js/' + script);
                }
            }

            if (newRoute.title && this.titlePageElement) {
                this.titlePageElement.innerText = newRoute.title + ' | Lumincoin Finance';
            }

            if (newRoute.template) {
                let contentBlock: HTMLElement | null = this.contentPageElement;
                if (newRoute.useLayout) {
                    if (this.contentPageElement) {
                        this.contentPageElement.innerHTML = await fetch(newRoute.useLayout as string).then(response => response.text());
                    }
                    contentBlock = document.getElementById("content-layout");

                    const userInfo: string | null = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                    if (userInfo) {
                        const profileName: UserInfoType | null = JSON.parse(userInfo);
                        if (profileName) {
                            const profileNameElement: HTMLElement | null = document.getElementById('profile-name');
                            if (profileNameElement) {
                                profileNameElement.innerText = profileName.name + ' ' + profileName.lastName;
                            }
                        }
                    }

                    new Layout(this.openNewRoute.bind(this));
                    this.activateMenuItem(newRoute);
                }

                if (contentBlock) {
                    contentBlock.innerHTML = await fetch(newRoute.template).then(response => response.text());
                }
            }

            if (newRoute.load && typeof newRoute.load === 'function') {
                newRoute.load();
            }
        } else {
            console.log('No route found');
        }
    }

    private activateMenuItem(route: RouteType): void {
        const categoryElement: HTMLElement | null = document.getElementById('category');
        const categoryCollapse: HTMLElement | null = document.getElementById("category-collapse");
        document.querySelectorAll('.sidebar .nav-link').forEach((item: Element) => {
            const href: string | null = item.getAttribute('href');
            if (href !== null) {
                if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                    if (categoryElement && item.classList.contains('sub-category')) {
                        categoryElement.classList.remove('collapsed');
                        categoryElement.classList.add('rounded-bottom-0');
                        categoryElement.setAttribute('aria-expanded', 'true');
                        if (categoryCollapse) {
                            categoryCollapse.classList.add('show');
                        }
                        CommonUtils.activateLink(categoryElement);
                    }
                    CommonUtils.activateLink(item);
                } else {
                    CommonUtils.unactivateLink(item);
                }
            }
        });

        if (categoryElement) {
            categoryElement.addEventListener('click', (e: MouseEvent) => {
                (e.target as HTMLElement).classList.toggle('rounded-bottom-0');
                (e.target as HTMLElement).classList.toggle('collapsed');
                (e.target as HTMLElement).classList.toggle('aria-expanded');
                if (categoryCollapse) {
                    categoryCollapse.classList.toggle('show');
                }
                if ((e.target as HTMLElement).classList.contains('collapsed')) {
                    CommonUtils.unactivateLink(e.target as HTMLElement);
                } else {
                    CommonUtils.activateLink(e.target as HTMLElement);
                }
            });
        }
    }
}