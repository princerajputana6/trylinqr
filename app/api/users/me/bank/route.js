import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { ok, fail } from '@/lib/api';
import { requireUser } from '@/lib/auth';

// Validate Indian IFSC: 4 letters + 0 + 6 alphanumeric
function isValidIFSC(s) {
  return /^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(s || '').toUpperCase());
}
function isValidPAN(s) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(String(s || '').toUpperCase());
}

export async function GET() {
  try {
    const auth = await requireUser(['admin', 'superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const user = await User.findById(auth.user.id).select('bankAccount');
    return ok({ bankAccount: user?.bankAccount || null });
  } catch (e) {
    console.error(e);
    return fail('Failed to load bank details', 500);
  }
}

export async function PUT(req) {
  try {
    const auth = await requireUser(['admin', 'superadmin']);
    if (auth.error) return fail(auth.error, auth.status);

    await connectDB();
    const body = await req.json();
    const {
      accountHolderName,
      accountNumber,
      ifsc,
      bankName,
      branch,
      panNumber,
      upiId,
      cancelledCheque,
      accountStatement,
    } = body || {};

    // Allow saving a UPI-only setup OR a bank-account setup
    const hasBank = accountHolderName || accountNumber || ifsc;
    if (hasBank) {
      if (!accountHolderName?.trim())
        return fail('Account holder name is required');
      if (!accountNumber || !/^\d{8,18}$/.test(accountNumber))
        return fail('Account number must be 8–18 digits');
      if (!ifsc || !isValidIFSC(ifsc))
        return fail('IFSC looks invalid (e.g. HDFC0001234)');
      if (!bankName?.trim()) return fail('Bank name is required');
    }
    if (panNumber && !isValidPAN(panNumber))
      return fail('PAN looks invalid (e.g. ABCDE1234F)');

    const user = await User.findById(auth.user.id);
    if (!user) return fail('Not found', 404);

    const next = {
      accountHolderName: accountHolderName?.trim(),
      accountNumber: accountNumber?.trim(),
      ifsc: ifsc?.toUpperCase().trim(),
      bankName: bankName?.trim(),
      branch: branch?.trim(),
      panNumber: panNumber?.toUpperCase().trim(),
      upiId: upiId?.trim(),
      updatedAt: new Date(),
    };
    // optional proof uploads (FileUploader payload or null to clear)
    if (cancelledCheque !== undefined) {
      next.cancelledChequeUrl = cancelledCheque?.url || '';
      next.cancelledChequeName =
        cancelledCheque?.originalName || cancelledCheque?.url || '';
    } else if (user.bankAccount) {
      next.cancelledChequeUrl = user.bankAccount.cancelledChequeUrl;
      next.cancelledChequeName = user.bankAccount.cancelledChequeName;
    }
    if (accountStatement !== undefined) {
      next.accountStatementUrl = accountStatement?.url || '';
      next.accountStatementName =
        accountStatement?.originalName || accountStatement?.url || '';
    } else if (user.bankAccount) {
      next.accountStatementUrl = user.bankAccount.accountStatementUrl;
      next.accountStatementName = user.bankAccount.accountStatementName;
    }
    // Re-trigger verification when bank info or proofs change
    next.verificationStatus =
      next.cancelledChequeUrl || next.accountStatementUrl
        ? 'pending'
        : 'unverified';

    user.bankAccount = next;
    await user.save();

    return ok({ message: 'Payout details saved', bankAccount: next });
  } catch (e) {
    console.error(e);
    return fail('Failed to save', 500);
  }
}
