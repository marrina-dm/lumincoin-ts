export class CommonUtils {
    public static activateLink(element: Element): void {
        element.classList.add('active');
        element.classList.add('text-white');
        element.classList.remove('text-primary-emphasis');

        const svg: HTMLElement | null = element.querySelector('svg path');
        if (svg) {
            svg.style.fill = '#fff';
        }
    }

    public static unactivateLink(element: Element): void {
        element.classList.remove('text-white');
        if (!element.classList.contains('sub-category')) {
            element.classList.add('text-primary-emphasis');
        }

        const svg: HTMLElement | null = element.querySelector('svg path');
        if (svg) {
            svg.style.fill = '#052C65';
        }

        element.classList.remove('active');
    }
}