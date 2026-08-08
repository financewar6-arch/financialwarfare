// SEC Edgar API integration for fetching 10-K filings
// Fallback mode: returns mock summaries since SEC Edgar API requires complex parsing

const TICKER_TO_CIK: Record<string, string> = {
  AAPL: "0000320193",
  NVDA: "0001045810",
  GOOGL: "0001018724",
  MSFT: "0000789019",
  AMZN: "0001018724",
  TSLA: "0001318605",
  META: "0001326801",
  BRK: "0001067983",
};

interface CompanyFiling {
  filing_date: string;
  filing_type: string;
  filing_url: string;
  accession_number: string;
  cik: string;
}

// Mock filing data for demonstration
const MOCK_FILINGS: Record<string, CompanyFiling> = {
  AAPL: {
    filing_date: "2024-11-08",
    filing_type: "10-K",
    filing_url: "https://www.sec.gov/cgi-bin/viewer?action=view&cik=0000320193",
    accession_number: "0000320193-24-000110",
    cik: "0000320193",
  },
  NVDA: {
    filing_date: "2024-09-27",
    filing_type: "10-K",
    filing_url: "https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001045810",
    accession_number: "0001045810-24-000037",
    cik: "0001045810",
  },
  GOOGL: {
    filing_date: "2024-02-01",
    filing_type: "10-K",
    filing_url: "https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001018724",
    accession_number: "0001018724-24-000002",
    cik: "0001018724",
  },
  MSFT: {
    filing_date: "2024-08-22",
    filing_type: "10-K",
    filing_url: "https://www.sec.gov/cgi-bin/viewer?action=view&cik=0000789019",
    accession_number: "0000789019-24-000039",
    cik: "0000789019",
  },
  AMZN: {
    filing_date: "2024-01-30",
    filing_type: "10-K",
    filing_url: "https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001018724",
    accession_number: "0001018724-24-000004",
    cik: "0001018724",
  },
  TSLA: {
    filing_date: "2024-01-29",
    filing_type: "10-K",
    filing_url: "https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001318605",
    accession_number: "0001318605-24-000010",
    cik: "0001318605",
  },
  META: {
    filing_date: "2024-02-01",
    filing_type: "10-K",
    filing_url: "https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001326801",
    accession_number: "0001326801-24-000009",
    cik: "0001326801",
  },
  BRK: {
    filing_date: "2024-02-23",
    filing_type: "10-K",
    filing_url: "https://www.sec.gov/cgi-bin/viewer?action=view&cik=0001067983",
    accession_number: "0001067983-24-000006",
    cik: "0001067983",
  },
};

export async function fetchLatest10K(ticker: string): Promise<CompanyFiling | null> {
  const upperTicker = ticker.toUpperCase();

  // Return mock filing data for demo
  if (MOCK_FILINGS[upperTicker]) {
    return MOCK_FILINGS[upperTicker];
  }

  console.warn(`No filing data available for ${ticker}`);
  return null;
}

export async function fetch10KText(filing: CompanyFiling): Promise<string | null> {
  // Return mock filing text for demo purposes
  return `
ITEM 1. BUSINESS

The Company is a leading technology innovator with diverse product and service offerings across multiple markets. Our business segments include:

- Hardware: Consumer electronics and computing devices
- Software: Operating systems and productivity applications
- Services: Cloud computing, subscription services, and digital content platforms
- Enterprise: Business solutions and developer platforms

Key Performance Metrics:
- Revenue growth: 5-8% year-over-year
- Operating margin: 25-30%
- Free cash flow: $15-20 billion annually

ITEM 1A. RISK FACTORS

Major risk factors include:
- Intense competition from both established and emerging competitors
- Regulatory pressures in key markets including antitrust investigations
- Supply chain disruptions and component costs
- Currency fluctuations affecting international operations
- Cybersecurity threats and data privacy concerns
- Technology obsolescence and R&D investment requirements

ITEM 7. MANAGEMENT'S DISCUSSION AND ANALYSIS

Revenue Performance:
The company achieved strong revenue growth this year, driven by increased demand for cloud services and enterprise solutions. Geographic diversification helped mitigate regional economic headwinds.

Operating Expenses:
R&D spending increased to support innovation in AI and quantum computing. Sales and marketing investments grew modestly as we leverage digital channels more effectively.

Capital Allocation:
The company returned $50+ billion to shareholders through dividends and share buybacks while maintaining balance sheet strength. Debt levels remain at comfortable ratios relative to cash flow generation.

ITEM 8. FINANCIAL STATEMENTS AND SUPPLEMENTARY DATA

(Summary of key financial metrics from audited statements)

Total Assets: $350+ billion
Total Revenue: $200+ billion annually
Net Income: $50+ billion
Cash Position: $100+ billion
Shareholders' Equity: $200+ billion

FORWARD LOOKING STATEMENTS

Management expects continued growth in cloud services and AI products. Capital expenditures will remain elevated to support infrastructure needs. Operating margins are expected to expand through operational leverage.
  `;
}
