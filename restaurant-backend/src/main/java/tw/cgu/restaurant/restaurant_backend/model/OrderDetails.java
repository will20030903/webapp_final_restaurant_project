package tw.cgu.restaurant.restaurant_backend.model;

import java.math.BigDecimal;

import jakarta.persistence.*;


@Entity
@Table(name = "OrderDetails")


public class OrderDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long odId;

    public OrderDetails() {
		
		
	}

	public OrderDetails(OrderInfo orderInfo, Dish dish, SetMeal setMeal, Integer quantity, BigDecimal subTotal) {
		super();
		this.orderInfo = orderInfo;
		this.dish = dish;
		this.setMeal = setMeal;
		this.quantity = quantity;
		this.subTotal = subTotal;
	}

	// 訂單明細屬於哪張訂單
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "oId", foreignKey = @ForeignKey(name = "FK_OrderDetails_OrderInfo"))
    private OrderInfo orderInfo;

    // 如果是單點，此欄位不為 null
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dNo", nullable = true, foreignKey = @ForeignKey(name = "FK_OrderDetails_Dish"))
    private Dish dish;

    // 如果是套餐，此欄位不為 null
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sNo", nullable = true, foreignKey = @ForeignKey(name = "FK_OrderDetails_SetMeal"))
    private SetMeal setMeal;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal subTotal = BigDecimal.ZERO;

    /**
     * 由於目前 JPA / MySQL 版本可能不支援 CHECK 條件，需要在 Service 或
     * Entity 的 @PrePersist/@PreUpdate 進行驗證：要麼 dish 不為 null 且 setMeal 為 null，
     * 要麼 dish 為 null 且 setMeal 不為 null。請勿兩者同時有值或同時都空。
     */
    @PrePersist
    @PreUpdate
    private void validateItemType() {
        if ((dish == null && setMeal == null) || (dish != null && setMeal != null)) {
            throw new IllegalArgumentException("OrderDetails 必須且只能選擇單點 (dish) 或套餐 (setMeal) 其一");
        }
    }

	public Long getOdId() {
		return odId;
	}

	public void setOdId(Long odId) {
		this.odId = odId;
	}

	public OrderInfo getOrderInfo() {
		return orderInfo;
	}

	public void setOrderInfo(OrderInfo orderInfo) {
		this.orderInfo = orderInfo;
	}

	public Dish getDish() {
		return dish;
	}

	public void setDish(Dish dish) {
		this.dish = dish;
	}

	public SetMeal getSetMeal() {
		return setMeal;
	}

	public void setSetMeal(SetMeal setMeal) {
		this.setMeal = setMeal;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public BigDecimal getSubTotal() {
		return subTotal;
	}

	public void setSubTotal(BigDecimal subTotal) {
		this.subTotal = subTotal;
	}
}
