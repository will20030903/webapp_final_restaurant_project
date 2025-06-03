package tw.cgu.restaurant.restaurant_backend.model;

import java.math.BigDecimal;

import jakarta.persistence.*;


@Entity
@Table(name = "Dish",
       uniqueConstraints = {
           @UniqueConstraint(name = "UQ_Dish_dName", columnNames = "dName")
       })


public class Dish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dNo;

    @Column(nullable = false, length = 100)
    private String dName;

    @Column(columnDefinition = "TEXT")
    private String dDesc;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal dPrice;

    @Column(nullable = false, length = 50)
    private String dType;

	public Long getdNo() {
		return dNo;
	}

	public Dish() {
		
		
	}

	public Dish(String dName, String dDesc, BigDecimal dPrice, String dType) {
		super();
		this.dName = dName;
		this.dDesc = dDesc;
		this.dPrice = dPrice;
		this.dType = dType;
	}

	public void setdNo(Long dNo) {
		this.dNo = dNo;
	}

	public String getdName() {
		return dName;
	}

	public void setdName(String dName) {
		this.dName = dName;
	}

	public String getdDesc() {
		return dDesc;
	}

	public void setdDesc(String dDesc) {
		this.dDesc = dDesc;
	}

	public BigDecimal getdPrice() {
		return dPrice;
	}

	public void setdPrice(BigDecimal dPrice) {
		this.dPrice = dPrice;
	}

	public String getdType() {
		return dType;
	}

	public void setdType(String dType) {
		this.dType = dType;
	}
}
