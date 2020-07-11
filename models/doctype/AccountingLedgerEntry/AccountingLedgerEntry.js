const $scopes = {};
if (process.env.IS_ELECTRON !== 'true') {
  $scopes.topExpenses = function(knex, filters) {
    const expenseAccounts = knex
      .select('name')
      .from('Account')
      .where('rootType', 'Expense');
    const builder = knex
      .select({
        total: knex.raw('sum(??) - sum(??)', ['debit', 'credit'])
      })
      .select('account')
      .from('AccountingLedgerEntry')
      .where('account', 'in', expenseAccounts)
      .whereBetween('date', [filters.fromDate, filters.toDate])
      .groupBy('account')
      .orderBy('total', 'desc')
      .limit(5);
    delete filters.fromDate;
    delete filters.toDate;
    return builder;
  };

  $scopes.totalInOutFlow = function(knex, filters) {
    const { fromDate, toDate } = filters;
    const cashAndBankAccounts = knex('Account')
      .select('name')
      .where('accountType', 'in', ['Cash', 'Bank'])
      .andWhere('isGroup', 0);
    const dateAsMonthYear = knex.raw('strftime("%m-%Y", ??)', 'date');
    const builder = knex('AccountingLedgerEntry')
      .sum({
        inflow: 'debit',
        outflow: 'credit'
      })
      .select({
        'month-year': dateAsMonthYear
      })
      .where('account', 'in', cashAndBankAccounts)
      .whereBetween('date', [fromDate, toDate])
      .groupBy(dateAsMonthYear);
    delete filters.fromDate;
    delete filters.toDate;
    return builder;
  };
}
module.exports = {
  name: 'AccountingLedgerEntry',
  label: 'Ledger Entry',
  naming: 'autoincrement',
  doctype: 'DocType',
  $scopes,
  isSingle: 0,
  isChild: 0,
  keywordFields: ['account', 'party', 'referenceName'],
  fields: [
    {
      fieldname: 'date',
      label: 'Date',
      fieldtype: 'Date'
    },
    {
      fieldname: 'account',
      label: 'Account',
      fieldtype: 'Link',
      target: 'Account',
      required: 1
    },
    {
      fieldname: 'description',
      label: 'Description',
      fieldtype: 'Text'
    },
    {
      fieldname: 'party',
      label: 'Party',
      fieldtype: 'Link',
      target: 'Party'
    },
    {
      fieldname: 'debit',
      label: 'Debit',
      fieldtype: 'Currency'
    },
    {
      fieldname: 'credit',
      label: 'Credit',
      fieldtype: 'Currency'
    },
    {
      fieldname: 'againstAccount',
      label: 'Against Account',
      fieldtype: 'Text'
    },
    {
      fieldname: 'referenceType',
      label: 'Ref. Type',
      fieldtype: 'Data'
    },
    {
      fieldname: 'referenceName',
      label: 'Ref. Name',
      fieldtype: 'DynamicLink',
      references: 'referenceType'
    },
    {
      fieldname: 'balance',
      label: 'Balance',
      fieldtype: 'Currency'
    }
  ],
  quickEditFields: [
    'date',
    'account',
    'description',
    'party',
    'debit',
    'credit',
    'againstAccount',
    'referenceType',
    'referenceName',
    'balance'
  ]
};
