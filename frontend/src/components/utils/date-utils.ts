export class DateUtils {

    public static currentDate: Date;
    public static currentDateTo: string;
    public static currentDay: number;
    public static currentMonth: number;
    public static currentYear: number;
    public static dateFrom: string;
    public static dateTo: string;

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

