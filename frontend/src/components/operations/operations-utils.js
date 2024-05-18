export class operationsUtils {

    static id;
    static type;
    static category;
    static amount;
    static date;
    static comment;
    static currentFilter = 'today';

    static operationEdit(id, type, category, amount, date, comment) {
        this.id = id;
        this.type = type === 'income' ? 'Доход' : 'Расход';
        this.category = category;
        this.amount = amount;
        this.date = date;
        this.comment = comment;
    }

}