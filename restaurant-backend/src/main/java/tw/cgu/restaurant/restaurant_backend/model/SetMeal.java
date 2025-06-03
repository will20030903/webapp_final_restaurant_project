package tw.cgu.restaurant.restaurant_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "SetMeal",
       uniqueConstraints = {
           @UniqueConstraint(name = "UQ_SetMeal_sName", columnNames = "sName")
       })


public class SetMeal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sNo;

    @Column(nullable = false, length = 100)
    private String sName;

    public SetMeal() {
		
		
	}

	public SetMeal(String sName, String sDesc, BigDecimal sPrice, List<SetDish> setDishes) {
		super();
		this.sName = sName;
		this.sDesc = sDesc;
		this.sPrice = sPrice;
		this.setDishes = setDishes;
	}

	@Column(columnDefinition = "TEXT")
    private String sDesc;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal sPrice;

    /**
     * 套餐與單點是 N:M，需要一張聯結表 Set_Dish。
     * mappedBy = "setMeal" 對應 SetDish 內部的 setMeal 欄位。
     * orphanRemoval=true 表示若從此 List 移除 SetDish，該筆在 DB 也會被刪除 (cascade ALL + orphanRemoval=TRUE 等同 ON DELETE CASCADE)。
     */
    @OneToMany(mappedBy = "setMeal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SetDish> setDishes;

	public Long getsNo() {
		return sNo;
	}

	public void setsNo(Long sNo) {
		this.sNo = sNo;
	}

	public String getsName() {
		return sName;
	}

	public void setsName(String sName) {
		this.sName = sName;
	}

	public String getsDesc() {
		return sDesc;
	}

	public void setsDesc(String sDesc) {
		this.sDesc = sDesc;
	}

	public BigDecimal getsPrice() {
		return sPrice;
	}

	public void setsPrice(BigDecimal sPrice) {
		this.sPrice = sPrice;
	}

	public List<SetDish> getSetDishes() {
		return setDishes;
	}

	public void setSetDishes(List<SetDish> setDishes) {
		this.setDishes = setDishes;
	}
}