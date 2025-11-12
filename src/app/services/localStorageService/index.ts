class LocalStorageService {
    static adicionarItem(chave: string, valor: string): void {
        if (typeof window !== "undefined") {
            console.log("adiciona")
            localStorage.setItem(chave, JSON.stringify(valor));
        }
    }

    static obterItem(chave: string): string | null {
        const item = localStorage.getItem(chave);
console.log("obtem")
        return JSON.stringify(item)

    }
}

export default LocalStorageService;
