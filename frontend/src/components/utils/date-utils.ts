export class DateUtils {

    static currentDate: Date;
    static currentDateTo: string;
    static currentDay: number;
    static currentMonth: number;
    static currentYear: number;
    static dateFrom: string;
    static dateTo: string;

    static createDate():void {
        this.currentDate = new Date();
        this.currentDateTo = this.currentDate.getFullYear() + '-' + (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDate();
        this.currentDay = this.currentDate.getDate();
        this.currentMonth = this.currentDate.getMonth() + 1;
        this.currentYear = this.currentDate.getFullYear();

        this.dateFrom = '';
        this.dateTo = '';
    }
}

