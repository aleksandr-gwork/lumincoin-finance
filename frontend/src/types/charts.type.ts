export type ChartsType = {

}

export type ChartsLoadDataType = {
    labels:string[],
    datasets: {
        label: string,
        data: number[],
        borderWidth: number
    }[],
}

export type ChartsOptionsType = {
    plugins: {
        title: {
            display: boolean,
            text: string,
            font: {
                size: number,
            },
            color: string,
            padding: {
                bottom: number,
            }
        }
    }
}