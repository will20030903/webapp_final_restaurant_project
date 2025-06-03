package tw.cgu.restaurant.restaurant_backend.model;

import jakarta.persistence.*;


@Entity
@Table(name = "set_dish") // 資料庫表名用小寫底線


public class SetDish {

    @EmbeddedId
    private SetDishKey id;

    public SetDish() {
		
		
	}

	/** 套餐中此單點的份數 (例如 A 套餐包 1 份「南洋炒泡麵」) */
    @Column(nullable = false)
    private Integer quantity = 1;

    /** 多對一對應到 SetMeal，並且用 MapsId("sNo") 取用 SetDishKey 裡的 sNo */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("sNo")
    @JoinColumn(name = "s_no", foreignKey = @ForeignKey(name = "FK_SetDish_SetMeal"))
    private SetMeal setMeal;

    /** 多對一對應到 Dish，並且用 MapsId("dNo") 取用 SetDishKey 裡的 dNo */
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("dNo")
    @JoinColumn(name = "d_no", foreignKey = @ForeignKey(name = "FK_SetDish_Dish"))
    private Dish dish;

    // （可選）方便程式內部 new SetDish
    public SetDish(Integer quantity, SetMeal setMeal, Dish dish) {
        this.quantity = quantity;
        this.setMeal = setMeal;
        this.dish = dish;
        this.id = new SetDishKey(setMeal.getsNo(), dish.getdNo());
    }

	public SetDishKey getId() {
		return id;
	}

	public void setId(SetDishKey id) {
		this.id = id;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public SetMeal getSetMeal() {
		return setMeal;
	}

	public void setSetMeal(SetMeal setMeal) {
		this.setMeal = setMeal;
	}

	public Dish getDish() {
		return dish;
	}

	public void setDish(Dish dish) {
		this.dish = dish;
	}
}