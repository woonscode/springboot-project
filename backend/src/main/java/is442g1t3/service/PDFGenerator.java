package is442g1t3.service;

import org.springframework.stereotype.Service;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfWriter;

import jakarta.servlet.http.HttpServletResponse;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

@Service
public class PDFGenerator {
  public void export(HttpServletResponse response) throws IOException {
    Document document = new Document(PageSize.A4);
    PdfWriter.getInstance(document, response.getOutputStream());

    document.open();
    Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
    fontTitle.setSize(18);

    Paragraph paragraph = new Paragraph("This is a title.", fontTitle);
    paragraph.setAlignment(Paragraph.ALIGN_CENTER);

    Font fontParagraph = FontFactory.getFont(FontFactory.HELVETICA);
    fontParagraph.setSize(12);

    Paragraph paragraph2 = new Paragraph("This is a paragraph.", fontParagraph);
    paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

    document.add(paragraph);
    document.add(paragraph2);
    document.close();
  }

  // function to create image element from bas64 string, to be added to pdf
  public Image createImage(String imageBase64)
      throws BadElementException, MalformedURLException, IOException {
    String data = imageBase64.split(",")[1];
    byte[] imageBytes = Base64.getDecoder().decode(data);
    Image image = Image.getInstance(imageBytes);
    image.scaleToFit(100, 100);
    return image;
  }

  // function to create image element from byte array, to be added to pdf
  public Image createImage(byte[] picture) throws IOException {
    Image image = Image.getInstance(picture);
    image.scaleToFit(100, 100);
    image.setAlignment(Image.ALIGN_CENTER);
    return image;
  }

  // function to create table element to be added to pdf
  public PdfPTable createTable(String[] header, String[][] data) {
    PdfPTable table = new PdfPTable(header.length);
    table.setWidthPercentage(100);
    table.setSpacingBefore(10f);
    table.setSpacingAfter(10f);

    PdfPCell cell = new PdfPCell();
    cell.setPadding(5);

    for (String column : header) {
      cell.setPhrase(new Phrase(column));
      table.addCell(cell);
    }

    for (String[] row : data) {
      for (String column : row) {
        table.addCell(column);
      }
    }

    return table;
  }

/**
 * Exports a PDF, with details in the PDF generated dynamically as needed. 
 */

  // Function to create a pdf with a title, image, table and paragraph
  public void exportDynamic(HttpServletResponse response, String title, String imagePath,
      String[] header, String[][] data, String paragraphText) throws IOException {
    Document document = new Document(PageSize.A4);
    PdfWriter.getInstance(document, response.getOutputStream());

    document.open();
    Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
    fontTitle.setSize(18);

    Paragraph paragraph = new Paragraph(title, fontTitle);
    paragraph.setAlignment(Paragraph.ALIGN_CENTER);

    Font fontParagraph = FontFactory.getFont(FontFactory.HELVETICA);
    fontParagraph.setSize(12);

    Paragraph paragraph2 = new Paragraph(paragraphText, fontParagraph);
    paragraph2.setAlignment(Paragraph.ALIGN_LEFT);

    document.add(paragraph);
    // Add pdfImage to pdf
    document.add(createImage(imagePath));
    document.add(createTable(header, data));
    document.add(paragraph2);
    document.close();
  }


  /**
   * Currently there is no support for destinations besides the Zoo. This can be implemented by storing a map from the destination name to their addresses
   * @return a ByteArrayOutputStream of the generated Letter of Authorisation PDF.
   * @throws IOException 
   */
  public ByteArrayOutputStream generateLOA(String empName, String visitDate) throws IOException {
    byte[] picture = Files.readAllBytes(Paths.get("images/sports_school_logo.png"));
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    Document document = new Document(PageSize.A4);
    PdfWriter.getInstance(document, bos);

    document.open();
    Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
    fontTitle.setSize(18);


    Font fontParagraph = FontFactory.getFont(FontFactory.HELVETICA);
    fontParagraph.setSize(12);
    Font bold = FontFactory.getFont(FontFactory.HELVETICA_BOLD);

    Paragraph date = new Paragraph(String.format("Date: %s",
        LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMM uuuu"))), fontParagraph);
    date.setAlignment(Paragraph.ALIGN_LEFT);

    Paragraph address = new Paragraph(
        "\nWildlife Reserves Singapore\n80 Mandai Lake Road\nSingapore 729826", fontParagraph);
    address.setAlignment(Paragraph.ALIGN_LEFT);

    Paragraph salutation = new Paragraph("\nDear Sir/Madam:", fontParagraph);
    fontParagraph.setStyle(Font.BOLD);
    Paragraph authDate =
        new Paragraph("AUTHORISATION LETTER - \n PREMIUM COPORATE FRIENDS OF THE ZOO (CFOZ)", bold);
    fontParagraph.setStyle(Font.NORMAL);
    Paragraph chunk = new Paragraph(
        "\nSingapore Sports School hereby authorise our employee identified below, to utilise our CFOZ Premium Cards(s) on the date as indicated.");
    Paragraph visit = new Paragraph(String.format("Date of Visit: %s", visitDate), bold);
    Paragraph employeeName = new Paragraph(String.format("Name of Employee: %s", empName), bold);
    Paragraph end = new Paragraph(
        "\nThank you.\n\nHuman Resource Department\n(This is a system generated letter.)");

    document.add(createImage(picture));
    document.add(date);
    document.add(address);
    document.add(salutation);
    document.add(authDate);
    document.add(chunk);
    document.add(visit);
    document.add(employeeName);
    document.add(end);
    document.close();
    return bos;
  }



}
