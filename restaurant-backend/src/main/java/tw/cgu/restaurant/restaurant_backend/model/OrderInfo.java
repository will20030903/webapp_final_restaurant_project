package tw.cgu.restaurant.restaurant_backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "OrderInfo")


public class OrderInfo {
    public OrderInfo() {
		
		
	}

	public OrderInfo(LocalDateTime oDateTime, BigDecimal totalPrice, String payStatus, Customer customer,
			TableInfo tableInfo, List<OrderDetails> orderDetails) {
		super();
		this.oDateTime = oDateTime;
		this.totalPrice = totalPrice;
		this.payStatus = payStatus;
		this.customer = customer;
		this.tableInfo = tableInfo;
		this.orderDetails = orderDetails;
	}

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long oId;

    @Column(nullable = false)
    private LocalDateTime oDateTime = LocalDateTime.now();

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice = BigDecimal.ZERO;

    @Column(nullable = false, length = 20)
    private String payStatus = "未付款";

    // 訂單屬於哪個顧客
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cId", foreignKey = @ForeignKey(name = "FK_OrderInfo_Customer"))
    private Customer customer;

    // 訂單屬於哪張餐桌
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tId", foreignKey = @ForeignKey(name = "FK_OrderInfo_TableInfo"))
    private TableInfo tableInfo;

    // 一張訂單有多筆明細
    @OneToMany(mappedBy = "orderInfo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetails> orderDetails;

	public Long getoId() {
		return oId;
	}

	public void setoId(Long oId) {
		this.oId = oId;
	}

	public LocalDateTime getoDateTime() {
		return oDateTime;
	}

	public void setoDateTime(LocalDateTime oDateTime) {
		this.oDateTime = oDateTime;
	}

	public BigDecimal getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(BigDecimal totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getPayStatus() {
		return payStatus;
	}

	public void setPayStatus(String payStatus) {
		this.payStatus = payStatus;
	}

	public Customer getCustomer() {
		return customer;
	}

	public void setCustomer(Customer customer) {
		this.customer = customer;
	}

	public TableInfo getTableInfo() {
		return tableInfo;
	}

	public void setTableInfo(TableInfo tableInfo) {
		this.tableInfo = tableInfo;
	}

	public List<OrderDetails> getOrderDetails() {
		return orderDetails;
	}

	public void setOrderDetails(List<OrderDetails> orderDetails) {
		this.orderDetails = orderDetails;
	}
}
