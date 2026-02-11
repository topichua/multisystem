import {
  Document,
  // Image,
  Page,
  StyleSheet,
  Styles,
  Text,
  View,
} from '@react-pdf/renderer';
// import HeaderLogoPng from 'src/assets/logo/header-logo.png';
// import HeaderLogoSvg from 'src/assets/logo/header-logo.svg?react';
import { InvoiceDetails } from 'src/transport/invoice/invoice.dto';
import { formatDate } from 'src/utils/date-time';

type InvoiceProps = {
  invoice: InvoiceDetails;
};

const metaData = {
  title: 'AMA title',
  author: 'AMA author',
  creator: 'AMA creator',
  language: 'en-US',
};

const invoiceColors = {
  base: '#1A1C21',
  secondary: '#5E6470',
  borderSecondary: '#D7DAE0',
};

const baseTextStyle = {
  fontSize: 10,
  fontWeight: 400,
  color: invoiceColors.base,
};

const baseLogoStyle = {
  display: 'flex',
  width: 92,
  height: 'auto',
  marginLeft: 'auto',
};

const colStyle = {
  flexBasis: '33.33%',
  display: 'flex',
  flexDirection: 'column',
  padding: 16,
};

const styles = StyleSheet.create({
  page: {
    fontSize: 10,
    paddingTop: 32,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 32,
  },
  textPrimary: {
    ...baseTextStyle,
  },
  textPrimaryBold: {
    ...baseTextStyle,
    fontWeight: 600,
  },
  textSecondary: {
    ...baseTextStyle,
    color: invoiceColors.secondary,
  },
  textSecondaryWithMargin: {
    ...baseTextStyle,
    color: invoiceColors.secondary,
    marginBottom: 4,
  },
  textSecondaryBold: {
    ...baseTextStyle,
    fontWeight: 600,
    color: invoiceColors.secondary,
  },
  textSecondaryBoldWithMargin: {
    ...baseTextStyle,
    fontWeight: 600,
    color: invoiceColors.secondary,
    marginBottom: 4,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 32,
    position: 'relative',
  },
  headerCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: 500,
    letterSpacing: '0.33px',
    textTransform: 'uppercase',
    color: invoiceColors.secondary,
  },
  headerPdfLogo: {
    ...(baseLogoStyle as Styles),
  },
  headerFakeLogo: {
    ...(baseLogoStyle as Styles),
    position: 'absolute',
    top: 0,
    right: 0,
  },
  detailsRow: {
    display: 'flex',
    flexDirection: 'row',
    borderTop: `1px solid ${invoiceColors.borderSecondary}`,
    borderBottom: `1px solid ${invoiceColors.borderSecondary}`,
  },
  detailsColStart: {
    ...(colStyle as Styles),
    paddingLeft: 0,
  },
  detailsColMiddle: {
    ...(colStyle as Styles),
    borderRight: `1px solid ${invoiceColors.borderSecondary}`,
    borderLeft: `1px solid ${invoiceColors.borderSecondary}`,
  },
  detailsColEnd: {
    ...(colStyle as Styles),
    paddingRight: 0,
  },
  detailsColTitle: {
    marginBottom: 6,
    fontSize: 10,
    fontWeight: 600,
    color: invoiceColors.base,
  },
  detailsColTitleHidden: {
    color: 'transparent',
    marginBottom: 6,
    fontSize: 10,
    fontWeight: 600,
  },
  detailsColSubTitle: {
    marginBottom: 16,
    marginTop: 8,
    fontSize: 10,
    fontWeight: 600,
    color: invoiceColors.secondary,
  },
  detailsColSubTitleHidden: {
    marginBottom: 16,
    marginTop: 8,
    fontSize: 10,
    fontWeight: 600,
    color: 'transparent',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 16,
    paddingBottom: 100,
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: `1px solid ${invoiceColors.borderSecondary}`,
  },
  tableRowHeader: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottom: '1px solid #000',
  },
  tableColService: {
    flexGrow: 1,
    flexBasis: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  tableColQty: {
    width: 95,
    textAlign: 'right',
    paddingRight: 8,
    paddingLeft: 8,
  },
  tableColUnit: {
    width: 100,
    textAlign: 'right',
    paddingRight: 8,
    paddingLeft: 8,
  },
  tableColTotal: {
    width: 100,
    textAlign: 'right',
    paddingLeft: 8,
  },
  tableRowSummary: {
    display: 'flex',
    flexDirection: 'column',
    flexBasis: '100%',
  },
  tableColSummary: {
    // width: 213,
    marginLeft: 'auto',
    paddingTop: 8,
    paddingBottom: 8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  tableColSummaryBalance: {
    width: 213,
    marginTop: '-1px',
    marginLeft: 'auto',
    paddingTop: 10,
    paddingBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tableColSummarySecondaryBold: {
    ...baseTextStyle,
    fontWeight: 600,
    color: invoiceColors.secondary,
    width: 80,
    textAlign: 'right',
  },
  tableColSummaryPrimaryBold: {
    ...baseTextStyle,
    fontWeight: 600,
    color: invoiceColors.base,
    width: 80,
    textAlign: 'right',
  },
  footer: {
    paddingTop: 22,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTop: `1px solid ${invoiceColors.borderSecondary}`,
  },
  footerLine: {
    paddingRight: 16,
    paddingLeft: 16,
    fontWeight: 400,
    color: invoiceColors.secondary,
  },
  footerTitle: {
    marginRight: 'auto',
    fontSize: 10,
    fontWeight: 500,
    color: invoiceColors.secondary,
  },
  footerContacts: {
    ...baseTextStyle,
    fontWeight: 500,
    color: invoiceColors.secondary,
  },
});

const formattedNumber = (value: number) =>
  value.toLocaleString('en-AU', {
    style: 'currency',
    currency: 'AUD',
  });

export const Invoice = ({ invoice }: InvoiceProps) => {
  return (
    <Document {...metaData}>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header} fixed>
          <View style={styles.headerCol}>
            <Text style={styles.headerTitle}>INVOICE</Text>
            <Text style={styles.headerSubtitle}>#{invoice.invoiceNum}</Text>
          </View>
          <View style={styles.headerCol}>
            {/* next row used only for logo to export in PDF document */}
            {/* <Image style={styles.headerPdfLogo} src={HeaderLogoPng} /> */}
            {/* next row used only for visual display logo on site */}
            {/* <HeaderLogoSvg style={styles.headerFakeLogo} /> */}
          </View>
        </View>

        {/* REQUISITIONS */}
        <View style={styles.detailsRow}>
          <View style={styles.detailsColStart}>
            <Text style={styles.detailsColTitle}>Issued</Text>
            <Text style={styles.detailsColSubTitle}>
              {invoice.invoiceDate ? formatDate(invoice.invoiceDate) : '-'}
            </Text>
            <Text style={styles.detailsColTitleHidden}>Due</Text>
            <Text style={styles.detailsColSubTitleHidden}>
              {invoice.dueDate ? formatDate(invoice.dueDate) : '-'}
              NO DUE DATE FOR INVOICE
            </Text>
          </View>
          <View style={styles.detailsColMiddle}>
            <Text style={styles.detailsColTitle}>Billed to</Text>
            <Text style={styles.textSecondaryBoldWithMargin}>
              {invoice.userFullName}
            </Text>
            <Text style={styles.textSecondaryWithMargin}>
              {/* {invoice.billToMemberAddressLine1}{' '}
              {invoice.billToMemberAddressLine2} */}
            </Text>
            <Text style={styles.textSecondary}>
              Mem. No. {invoice.memberNum}
            </Text>
          </View>
          <View style={styles.detailsColEnd}>
            <Text style={styles.detailsColTitle}>From</Text>
            <Text style={styles.textSecondaryBoldWithMargin}>
              Australian Medical Association Victoria
            </Text>
            <Text style={styles.textSecondaryWithMargin}>
              293 Royal Parade Parkville VIC 3052
            </Text>
            <Text style={styles.textSecondary}>ABN 42 064 447 678</Text>
          </View>
        </View>

        {/* ROWS HEADER */}
        <View style={styles.table}>
          <View style={styles.tableRowHeader}>
            <View style={styles.tableColService}>
              <Text style={styles.textPrimary}>Service</Text>
            </View>
            <View style={styles.tableColQty}>
              <Text style={styles.textPrimary}>Qty</Text>
            </View>
            <View style={styles.tableColUnit}>
              <Text style={styles.textPrimary}>Unit price</Text>
            </View>
            <View style={styles.tableColTotal}>
              <Text style={styles.textPrimary}>Line total</Text>
            </View>
          </View>

          {/* ROWS */}
          {invoice.lineItems.map((item) => {
            return (
              <View style={styles.tableRow}>
                <View style={styles.tableColService}>
                  <Text style={styles.textPrimary}>{item.itemName}</Text>
                  <Text style={styles.textPrimary}>
                    Membership Period -
                    {formatDate(invoice.membershipStartDate || '')} to{' '}
                    {formatDate(invoice.membershipEndDate || '')}
                  </Text>
                </View>
                <View style={styles.tableColQty}>
                  <Text style={styles.textSecondaryBold}>{item.quantity}</Text>
                </View>
                <View style={styles.tableColUnit}>
                  <Text style={styles.textSecondaryBold}>
                    {formattedNumber(item.unitPrice)}
                  </Text>
                </View>
                <View style={styles.tableColTotal}>
                  <Text style={styles.textSecondaryBold}>
                    {formattedNumber(item.totalPrice)}
                  </Text>
                </View>
              </View>
            );
          })}

          {/* TOTAL */}
          <View style={styles.tableRowSummary}>
            {invoice.totalAmountExcGst > 0 && (
              <View style={styles.tableColSummary}>
                <Text style={styles.textPrimary}>
                  TOTAL AMOUNT (EXCLUDING GST)
                </Text>
                <Text style={styles.tableColSummarySecondaryBold}>
                  {formattedNumber(invoice.totalAmountExcGst)}
                </Text>
              </View>
            )}
            <View style={styles.tableColSummary}>
              <Text style={styles.textPrimary}>GST</Text>
              <Text style={styles.tableColSummarySecondaryBold}>
                {formattedNumber(invoice.totalGst)}
              </Text>
            </View>
            <View style={styles.tableColSummary}>
              <Text style={styles.textPrimary}>
                TOTAL CHARGE (INCLUDING GST)
              </Text>
              <Text style={styles.tableColSummarySecondaryBold}>
                {formattedNumber(invoice.netTotalAmount)}
              </Text>
            </View>
            <View style={styles.tableColSummary}>
              <Text style={styles.textPrimary}>PAYMENT RECIEVED</Text>
              <Text style={styles.tableColSummarySecondaryBold}>
                {formattedNumber(invoice.totalAmountPaid)}
              </Text>
            </View>
            <View style={styles.tableColSummaryBalance}>
              <Text style={styles.textPrimaryBold}>Balance due</Text>
              <Text style={styles.tableColSummaryPrimaryBold}>
                {formattedNumber(invoice.balanceDue)}
              </Text>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerTitle}>BOND MX</Text>
          <Text style={styles.footerContacts}>01 9333 9988</Text>
          <Text style={styles.footerLine}>|</Text>
          <Text style={styles.footerContacts}>email@bondmx.com.au</Text>
        </View>
      </Page>
    </Document>
  );
};
