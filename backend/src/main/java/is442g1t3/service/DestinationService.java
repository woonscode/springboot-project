package is442g1t3.service;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import is442g1t3.domain.Destination;
import is442g1t3.dto.DestinationResponse;
import is442g1t3.repository.DestinationRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class DestinationService {
  @Autowired
  DestinationRepo destinationRepo;

  public void addDestination(Destination destination) {
    destinationRepo.save(destination);
  }

  public void removeDestination(String destination) {
    try {
      Destination d = destinationRepo.findById(destination).get();
      String imagePath = d.getImage();
      File image = new File(imagePath);
      image.delete();
      destinationRepo.deleteById(destination);
    } catch (Exception e) {
      throw new RuntimeException(e.getMessage());
    }
  }

  public void updateDestination(Destination destination) {
    destinationRepo.save(destination);
  }

  public DestinationResponse getDestination(String destination) {
    Destination destinationObj = destinationRepo.findById(destination).get();
    return new DestinationResponse(destinationObj.getDestination(), destinationObj.getDescription(),
        destinationObj.getImage());
  }

  public List<DestinationResponse> getAllDestinations() {
    List<Destination> destinations = destinationRepo.findAll();
    List<DestinationResponse> destinationResponses = new ArrayList<DestinationResponse>();
    for (Destination destination : destinations) {
      String base64Image;
      try {
        base64Image = getImage(destination.getImage());
      } catch (Exception e) {
        log.error(e.getMessage());
        base64Image = "";
      }
      destinationResponses.add(new DestinationResponse(destination.getDestination(),
          destination.getDescription(), base64Image));
    }
    return destinationResponses;
  }

  public String saveImage(String base64Image, String imagePath) throws IOException {
    byte[] imageBytes = java.util.Base64.getDecoder().decode(base64Image);
    // if path does not exist, create it
    File file = new File(imagePath);
    file.getParentFile().mkdirs();
    // save image to file
    java.nio.file.Path path = java.nio.file.Paths.get(imagePath);
    java.nio.file.Files.write(path, imageBytes);
    // Add path to database
    return imagePath;
  }

  public String getImage(String imagePath) throws IOException {
    // read image from file
    java.nio.file.Path path = java.nio.file.Paths.get(imagePath);
    byte[] imageBytes = java.nio.file.Files.readAllBytes(path);
    // convert image to base64 string
    return "data:image/jpeg;base64," + java.util.Base64.getEncoder().encodeToString(imageBytes);
  }
}
