package is442g1t3.domain;

import java.util.ArrayList;
import java.util.Collection;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
  @Id
  @Column(unique = true)
  private String empId;
  @Column(unique = true)
  private String email;
  @Column(unique = true)
  private String username;
  private String phoneNo;
  private String name;
  private Double fine = 0.0;

  @ManyToMany(fetch = FetchType.EAGER,
      cascade = {CascadeType.ALL, CascadeType.MERGE, CascadeType.PERSIST})
  private Collection<Role> roles = new ArrayList<>();

  public String[] getRoleArray() {
    String[] roles = new String[this.roles.size()];
    int i = 0;
    for (Role role : this.roles) {
      roles[i] = role.getRole();
      i++;
    }
    return roles;
  }

  public void addRole(Role role) {
    this.roles.add(role);
  }

  public User(String empId2, String email2, String userName2, String phoneNo2, String name2) {
    this.empId = empId2;
    this.email = email2;
    this.username = userName2;
    this.phoneNo = phoneNo2;
    this.name = name2;
  }

}
