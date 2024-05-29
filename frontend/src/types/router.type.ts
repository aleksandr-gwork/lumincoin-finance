export type RouterType = {
    route: string,
    title?: string,
    template?: string,
    styles?: string,
    useSidebar?: string,
    load?: () => void
}