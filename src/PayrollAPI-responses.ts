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
}

export interface LeaveApplicationsResponse {
	LeaveApplications: LeaveApplication[];
}
