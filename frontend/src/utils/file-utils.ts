export class FileUtils {
    public static loadPageScript(src: string): Promise<string> {
        return new Promise((resolve: (value: string) => void, reject: (reason?: Error) => void) => {
            const script: HTMLScriptElement = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);
            script.onerror = () => reject(new Error(`Script load error for: ${src}`));
            document.body.appendChild(script);
        });
    }

    public static loadPageStyle(src: string): void {
        const link: HTMLLinkElement = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        document.head.appendChild(link);
    }
}