export class operationsUtils {

    static id: string;
    static type: string;
    static category: string;
    static amount: string;
    static date: string;
    static comment: string;
    static currentFilter: string = 'today';

    static operationEdit(id: string, type: string, category: string, amount: string, date: string, comment: string) {
        this.id = id;
        this.type = type === 'income' ? 'Доход' : 'Расход';
        this.category = category;
        this.amount = amount;
        this.date = date;
        this.comment = comment;
    }

}