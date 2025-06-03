package tw.cgu.restaurant.restaurant_backend.model;

import jakarta.persistence.*;


@Entity
@Table(name = "Customer",
       uniqueConstraints = {
           @UniqueConstraint(name = "UQ_Customer_cPhone", columnNames = "cPhone")
       })


public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cId;
    
    public Customer() {
		

	}
    public Customer(String cName, String cPhone) {
		super();
		this.cName = cName;
		this.cPhone = cPhone;
	}

	

	@Column(nullable = false, length = 100)
    private String cName;

    @Column(nullable = false, length = 20, unique = true)
    private String cPhone;

	public Long getcId() {
		return cId;
	}

	public void setcId(Long cId) {
		this.cId = cId;
	}

	public String getcName() {
		return cName;
	}

	public void setcName(String cName) {
		this.cName = cName;
	}

	public String getcPhone() {
		return cPhone;
	}

	public void setcPhone(String cPhone) {
		this.cPhone = cPhone;
	}

    // 如果想要雙向查詢：一個顧客有多張訂單
    // @OneToMany(mappedBy = "customer", cascade = CascadeType.ALL)
    // private List<OrderInfo> orders;
}
