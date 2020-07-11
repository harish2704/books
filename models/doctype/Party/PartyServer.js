const BaseDocument = require('frappejs/model/document');
const frappe = require('frappejs');

module.exports = class PartyServer extends BaseDocument {
  beforeInsert() {
    if (this.customer && this.supplier) {
      frappe.call({
        method: 'show-dialog',
        args: {
          title: 'Invalid Entry',
          message: 'Select a single party type.'
        }
      });
      throw new Error();
    }

    if (this.gstin && ['Unregistered', 'Consumer'].includes(this.gstType)) {
      this.gstin = '';
    }
  }

  async updateOutstandingAmount() {
    let isCustomer = this.customer;
    let doctype = isCustomer ? 'SalesInvoice' : 'PurchaseInvoice';
    let partyField = isCustomer ? 'customer' : 'supplier';
    let { totalOutstanding } = (
      await frappe.getAll({
        doctype: `View${doctype}Outstanding`,
        filters: {
          [partyField]: this.name
        },
        limit: 1
      })
    )[0];

    await this.set('outstandingAmount', this.round(totalOutstanding));
    await this.update();
  }
};
