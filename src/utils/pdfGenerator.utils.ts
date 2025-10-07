import PDFDocument from "pdfkit";
import { BrochureSummaryData } from "../models/brochure/aiBrochuresSummary.model";

export class PDFGenerator {
  private pageHeight: number = 792;
  private bottomMargin: number = 100;

  async generatePDF(summary: BrochureSummaryData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          margin: 50,
          size: "A4",
          info: {
            Title: "Insurance Product Summary",
            Author: "Insurance System",
            Subject: "Product Summary",
            CreationDate: new Date(),
          },
        });

        const buffers: Buffer[] = [];
        doc.on("data", (buffer) => buffers.push(buffer));
        doc.on("end", () => resolve(Buffer.concat(buffers)));
        doc.on("error", reject);

        // generate full content
        this.generateContent(doc, summary);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private generateContent(doc: PDFKit.PDFDocument, summary: BrochureSummaryData) {
    this.addHeader(doc);
    this.addProductOverview(doc, summary);
    this.addVariants(doc, summary.variants || []);
    this.addEligibility(doc, summary.eligibility_snapshot);
    this.addNotes(doc, summary.notes);
    this.setupFooter(doc);
  }

  private addHeader(doc: PDFKit.PDFDocument) {
    doc.fillColor("#2c3e50")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("INSURANCE PRODUCT SUMMARY", { align: "center" });
    doc.moveDown();
    doc.strokeColor("#3498db")
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(545, doc.y)
      .stroke();
    doc.moveDown();
  }

  private addProductOverview(doc: PDFKit.PDFDocument, summary: BrochureSummaryData) {
    this.addSection(doc, "PRODUCT OVERVIEW", () => {
      const productFields = [
        { label: "Product Name", value: summary.product_name },
        { label: "Product Code", value: summary.product_code },
        { label: "Insurer", value: summary.insurer },
        { label: "Description", value: summary.description },
        {
          label: "Effective From",
          value: summary.effective_from
            ? new Date(summary.effective_from).toLocaleDateString()
            : "N/A",
        },
        {
          label: "Effective To",
          value: summary.effective_to
            ? new Date(summary.effective_to).toLocaleDateString()
            : "N/A",
        },
      ];

      productFields.forEach((field) => {
        if (this.needsNewPage(doc, 20)) {
          doc.addPage();
        }
        doc.fillColor("#2c3e50")
          .fontSize(12)
          .font("Helvetica-Bold")
          .text(`${field.label}:`, { continued: true })
          .fillColor("#34495e")
          .font("Helvetica")
          .text(` ${field.value}`);
        doc.moveDown(0.3);
      });
    });
  }

  private addVariants(doc: PDFKit.PDFDocument, variants: any[]) {
    if (variants.length === 0) return;
    this.addSection(doc, "PLAN VARIANTS", () => {
      variants.forEach((variant: any, index: number) => {
        if (this.needsNewPage(doc, 100)) {
          doc.addPage();
        }
        doc.fillColor("#1f82c4ff")
          .fontSize(14)
          .font("Helvetica-Bold")
          .text(
            `Variant ${index + 1}: ${
              variant.variant_label || variant.variant_code || "Unnamed Variant"
            }`
          );
        doc.fillColor("#2c3e50")
          .fontSize(10)
          .font("Helvetica")
          .text(`Code: ${variant.variant_code || "N/A"}`);
        doc.moveDown(0.3);

        if (variant.summary) {
          if (this.needsNewPage(doc, 50)) {
            doc.addPage();
          }
          doc.fillColor("#34495e")
            .fontSize(11)
            .font("Helvetica")
            .text("Summary:", { continued: true })
            .fillColor("#7f8c8d")
            .text(` ${variant.summary}`);
        }
        doc.moveDown(0.8);

        if (index < variants.length - 1) {
          if (this.needsNewPage(doc, 30)) {
            doc.addPage();
          } else {
            doc.strokeColor("#bdc3c7")
              .lineWidth(0.5)
              .moveTo(50, doc.y)
              .lineTo(545, doc.y)
              .stroke();
            doc.moveDown(0.8);
          }
        }
      });
    });
  }

  private addEligibility(doc: PDFKit.PDFDocument, eligibility_snapshot: string) {
    if (!eligibility_snapshot) return;
    this.addSection(doc, "ELIGIBILITY CRITERIA", () => {
      try {
        const eligibility =
          typeof eligibility_snapshot === "string"
            ? JSON.parse(eligibility_snapshot)
            : eligibility_snapshot;
        this.addEligibilityFields(doc, eligibility);
      } catch {
        if (this.needsNewPage(doc, 100)) {
          doc.addPage();
        }
        doc.fillColor("#34495e")
          .fontSize(11)
          .font("Helvetica")
          .text(eligibility_snapshot, {
            align: "left",
            width: 500,
          });
      }
    });
  }

  private addEligibilityFields(doc: PDFKit.PDFDocument, eligibility: any) {
    const eligibilityFields = [
      { key: "min_age", label: "Minimum Age", suffix: " years" },
      { key: "max_age", label: "Maximum Age", suffix: " years" },
      { key: "income_requirements", label: "Income Requirements" },
      { key: "medical_conditions", label: "Medical Conditions" },
      { key: "occupation_restrictions", label: "Occupation Restrictions" },
      { key: "geographical_restrictions", label: "Geographical Restrictions" },
      { key: "family_conditions", label: "Family Conditions" },
      { key: "other_requirements", label: "Other Requirements" },
    ];

    eligibilityFields.forEach((field) => {
      if (eligibility[field.key]) {
        if (this.needsNewPage(doc, 20)) {
          doc.addPage();
        }
        doc.fillColor("#2c3e50")
          .fontSize(11)
          .font("Helvetica-Bold")
          .text(`${field.label}:`, { continued: true })
          .fillColor("#34495e")
          .font("Helvetica")
          .text(` ${eligibility[field.key]}${field.suffix || ""}`);
        doc.moveDown(0.3);
      }
    });
  }

  private addNotes(doc: PDFKit.PDFDocument, notes: string) {
    if (!notes) return;
    this.addSection(doc, "ADDITIONAL NOTES", () => {
      if (this.needsNewPage(doc, 100)) {
        doc.addPage();
      }
      doc.fillColor("#34495e")
        .fontSize(11)
        .font("Helvetica")
        .text(notes, { align: "justify", width: 500 });
    });
  }

  private addSection(
    doc: PDFKit.PDFDocument,
    title: string,
    contentCallback: () => void
  ) {
    if (this.needsNewPage(doc, 150)) {
      doc.addPage();
    } else {
      doc.moveDown(2);
    }
    doc.fillColor("#2c3e50")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(title.toUpperCase());
    doc.moveDown(0.5);
    contentCallback();
  }

  private needsNewPage(doc: PDFKit.PDFDocument, requiredHeight: number = 100): boolean {
    return doc.y + requiredHeight > this.pageHeight - this.bottomMargin;
  }

  private setupFooter(doc: PDFKit.PDFDocument) {
    const addFooter = () => {
      const currentPage = doc.bufferedPageRange().count;
      doc.y = this.pageHeight - 50;
      doc.fillColor("#95a5a6")
        .fontSize(8)
        .font("Helvetica")
        .text(`Page ${currentPage}`, 50, doc.y, { align: "left" });
      doc.fillColor("#95a5a6")
        .fontSize(8)
        .font("Helvetica")
        .text(`Generated on: ${new Date().toLocaleDateString()}`, {
          align: "right",
          width: 500,
        });
    };

    doc.on("pageAdded", addFooter);
    addFooter();
  }
}

export default PDFGenerator;
