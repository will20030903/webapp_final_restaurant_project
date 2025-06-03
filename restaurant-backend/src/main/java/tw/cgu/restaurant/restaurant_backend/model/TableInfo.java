package tw.cgu.restaurant.restaurant_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "TableInfo")


public class TableInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tId;

    @Column(nullable = false)
    private Integer capacity;

    public TableInfo() {
		
		
	}

	public TableInfo(Integer capacity, String location) {
		super();
		this.capacity = capacity;
		this.location = location;
	}

	@Column(nullable = false, length = 100)
    private String location;

	public Long gettId() {
		return tId;
	}

	public void settId(Long tId) {
		this.tId = tId;
	}

	public Integer getCapacity() {
		return capacity;
	}

	public void setCapacity(Integer capacity) {
		this.capacity = capacity;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

    // 如果想做雙向映射：一張桌子可有多張訂單
    // @OneToMany(mappedBy = "tableInfo", cascade = CascadeType.ALL)
    
}
