export interface EmployeesResponse{
	EmployeeID: string;
	FirstName: string;
	LastName: string;
	Status: string;
	Email: string;
	LeaveBalances: LeaveBalance;
}

export interface LeaveBalance{
	LeaveName: string;
	LeaveTypeID: string;
	NumberOfUnits: number;
	TypeOfUnits: string;
}

export interface LeavePeriod {
	PayPeriodStartDate: Date;
	PayPeriodEndDate: Date;
	LeavePeriodStatus: string;
	NumberOfUnits: number;
}

export interface LeaveApplication {
	LeaveApplicationID: string;
	EmployeeID: string;
	LeaveTypeID: string;
	LeavePeriods: LeavePeriod[];
	StartDate: string;
	EndDate: string;
	UpdatedDateUTC: string;
}

export interface LeaveApplicationsResponse {
	LeaveApplications: LeaveApplication[];
}

export interface EarningsRate{
	Name: string;
}

export interface DeductionType{
	Name: string;
}

export interface LeaveType{
	Name: string;
	LeaveTypeID: string;
}

export interface ReimbursementType {
	Name: string;
}

export interface PayItems {
	EarningsRates: EarningsRate[];
	DeductionTypes: DeductionType[];
	LeaveTypes: LeaveType[];
	ReimbursementTypes: ReimbursementType[];
}

export interface PayItemsResponse{
	PayItems: PayItems;
}
