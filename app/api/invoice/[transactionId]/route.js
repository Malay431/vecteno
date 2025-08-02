import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import InvoicePDF from "@/components/pdf/InvoicePDF";
import connectToDatabase from "@/lib/db";
import Transaction from "@/app/models/transactionModel";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const transactionId = params.transactionId;

    const transaction = await Transaction.findById(transactionId).populate("userId");

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const invoiceData = {
      id: transaction._id.toString(),
      user: {
        name: transaction.userId.name,
        email: transaction.userId.email,
      },
      amount: transaction.amount,
      createdAt: transaction.createdAt,
    };

    const pdfStream = await renderToStream(
      <InvoicePDF transaction={invoiceData} />
    );

    return new NextResponse(pdfStream, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice_${transactionId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("🚨 Invoice PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
