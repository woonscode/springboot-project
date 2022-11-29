package is442g1t3.controller;

import java.util.HashMap;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import is442g1t3.domain.Destination;
import is442g1t3.dto.DestinationRequest;
import is442g1t3.dto.DestinationResponse;
import is442g1t3.dto.ResponseSchema;
import is442g1t3.service.DestinationService;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class DestinationController {
  private final DestinationService destinationService;

  @GetMapping("/user/getAllDestinations")
  public ResponseEntity<HashMap<String, Object>> getDestinations() {
    try {
      List<DestinationResponse> destinations = destinationService.getAllDestinations();
      return ResponseEntity.status(200)
          .body(new ResponseSchema(200, destinations).getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500)
          .body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  @PostMapping("/admin/addDestination")
  public ResponseEntity<HashMap<String, Object>> addDestination(
      @RequestBody DestinationRequest destination) {
    try {
      // save image base64 string to local file in /images
      String image = destination.getImage();
      String[] imageParts = image.split(",");
      String base64Image = imageParts[1];
      String imageType = imageParts[0].split("/")[1].split(";")[0];
      String imageName = destination.getDestination() + "." + imageType;
      String imagePath = "images/" + imageName;
      destinationService.saveImage(base64Image, imagePath);
      destinationService.addDestination(
          new Destination(destination.getDestination(), destination.getDescription(), imagePath));
      return ResponseEntity.status(200)
          .body(new ResponseSchema(200, (Object) "Destination added").getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500)
          .body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  @PutMapping("/admin/updateDestination")
  public ResponseEntity<HashMap<String, Object>> updateDestination(
      @RequestBody DestinationRequest destination) {
    try {
      // save image base64 string to local file in /images
      String image = destination.getImage();
      String imagePath;

      if (image != null) {
        String[] imageParts = image.split(",");
        String base64Image = imageParts[1];
        String imageType = imageParts[0].split("/")[1].split(";")[0];
        String imageName = destination.getDestination() + "." + imageType;
        imagePath = "images/" + imageName;
        destinationService.saveImage(base64Image, imagePath);
      } else {
        imagePath =
            destinationService.getDestination(destination.getDestination()).getImageBase64();
      }
      destinationService.updateDestination(
          new Destination(destination.getDestination(), destination.getDescription(), imagePath));
      return ResponseEntity.status(200)
          .body(new ResponseSchema(200, (Object) "Destination updated").getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500)
          .body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

  @DeleteMapping("/admin/deleteDestination")
  public ResponseEntity<HashMap<String, Object>> deleteDestination(
      @RequestBody DestinationRequest destination) {
    try {
      destinationService.removeDestination(destination.getDestination());
      return ResponseEntity.status(200)
          .body(new ResponseSchema(200, (Object) "Destination deleted").getSuccessResponse());
    } catch (Exception e) {
      return ResponseEntity.status(500)
          .body(new ResponseSchema(500, e.getMessage()).getErrorResponse());
    }
  }

}
