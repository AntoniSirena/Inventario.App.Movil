
export class PaginationObject {
    Records: Array<any>;
    Pagination: Pagination;
}


class Pagination {
    PageNumber: number;
    PageRow: number;
    TotalPage: number;
    TotalRecord: number;
}