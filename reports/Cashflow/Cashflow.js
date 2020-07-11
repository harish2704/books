const frappe = require('frappejs');
const { getPeriodList } = require('../FinancialStatements/FinancialStatements');
const { DateTime } = require('luxon');

class Cashflow {
  async run({ fromDate, toDate, periodicity }) {
    let res = await frappe.db.getAll({
      doctype: 'AccountingLedgerEntry',
      filters: {
        $scope: 'totalInOutFlow',
        fromDate,
        toDate
      }
    });

    let periodList = getPeriodList(fromDate, toDate, periodicity);

    let data = periodList.map(periodKey => {
      let monthYear = this.getMonthYear(periodKey, 'MMM yyyy');
      let cashflowForPeriod = res.find(d => d['month-year'] === monthYear);
      if (cashflowForPeriod) {
        cashflowForPeriod.periodKey = periodKey;
        return cashflowForPeriod;
      }
      return {
        inflow: 0,
        outflow: 0,
        periodKey,
        'month-year': monthYear
      };
    });

    return {
      data,
      periodList
    };
  }

  getMonthYear(periodKey, format) {
    return DateTime.fromFormat(periodKey, format).toFormat('MM-yyyy');
  }
}

module.exports = Cashflow;
