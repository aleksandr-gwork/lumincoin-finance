export class operationsUtils {

    public static id: string;
    public static type: string;
    public static category: string;
    public static amount: string;
    public static date: string;
    public static comment: string;
    public static currentFilter: string = 'today';

    public static operationEdit(id: string, type: string, category: string, amount: string, date: string, comment: string) {
        this.id = id;
        this.type = type === 'income' ? 'Доход' : 'Расход';
        this.category = category;
        this.amount = amount;
        this.date = date;
        this.comment = comment;
    }
}