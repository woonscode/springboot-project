package is442g1t3.controller;

import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import is442g1t3.dto.ResponseSchema;
import is442g1t3.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequiredArgsConstructor
@Slf4j
public class StatisticsController {
  private final StatisticsService statisticsService;

  @GetMapping(value = "/admin/statistics/getPassStatistics")
  public ResponseEntity<HashMap<String, Object>> getPassStatistics(@RequestParam String startDate,
      @RequestParam String endDate) {
    HashMap<String, Object> data = new HashMap<>();
    try {
      Map<String, Object> stats = statisticsService.getPassStatistics(startDate, endDate);
      data.put("startDate", startDate);
      data.put("endDate", endDate);
      data.put("passStatistics", stats);
      return ResponseEntity.ok(new ResponseSchema(200, data).getSuccessResponse());
    } catch (Exception e) {
      log.error(e.getMessage());
      return ResponseEntity.status(400)
          .body(new ResponseSchema(400, "Invalid date format").getErrorResponse());
    }
  }

  @GetMapping(value = "/admin/statistics/getUserStatistics")
  public ResponseEntity<HashMap<String, Object>> getUserStatistics() {
    try {
      return ResponseEntity
          .ok(new ResponseSchema(200, statisticsService.getUserStatistics()).getSuccessResponse());
    } catch (Exception e) {
      log.error(e.getMessage());
      return ResponseEntity.status(400)
          .body(new ResponseSchema(400, e.getMessage()).getErrorResponse());
    }
  }



}
