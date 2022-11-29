package is442g1t3.controller;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import is442g1t3.dto.PDFRequest;
import is442g1t3.service.PDFGenerator;

import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

@Controller
@RequestMapping("/admin")
public class PDFExportController {
  private final PDFGenerator pdfGenerator;

  public PDFExportController(PDFGenerator pdfGenerator) {
    this.pdfGenerator = pdfGenerator;
  }

  @GetMapping("/pdf/generate")
  public void generatePDF(HttpServletResponse response) throws IOException {
    response.setContentType("application/pdf");
    DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd:hh:mm:ss");
    String currentDateTime = dateFormatter.format(new Date());

    String headerKey = "Content-Disposition";
    String headerValue = "attachment; filename=pdf_" + currentDateTime + ".pdf";
    response.setHeader(headerKey, headerValue);

    this.pdfGenerator.export(response);
  }

  @PostMapping("/pdf/generate")
  public void generateDynamicPDF(@RequestBody PDFRequest request, HttpServletResponse response)
      throws IOException {
    response.setContentType("application/pdf");
    DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd:hh:mm:ss");
    String currentDateTime = dateFormatter.format(new Date());

    String headerKey = "Content-Disposition";
    String headerValue = "attachment; filename=pdf_" + currentDateTime + ".pdf";
    response.setHeader(headerKey, headerValue);

    // Parse Request Body into export Dynamic PDF
    this.pdfGenerator.exportDynamic(response, request.getTitle(), request.getImageBase64(),
        request.getHeader(), request.getData(), request.getParagraph());

  }
}
