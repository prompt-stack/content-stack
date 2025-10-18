-- Customer Analytics SQL Queries
-- Database: PostgreSQL 14
-- Purpose: Monthly reporting and customer insights

-- 1. Customer Lifetime Value (CLV) Calculation
WITH customer_purchases AS (
    SELECT 
        c.customer_id,
        c.first_name,
        c.last_name,
        c.registration_date,
        COUNT(DISTINCT o.order_id) as total_orders,
        SUM(o.total_amount) as lifetime_value,
        AVG(o.total_amount) as avg_order_value,
        MAX(o.order_date) as last_order_date
    FROM customers c
    LEFT JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.status = 'completed'
    GROUP BY c.customer_id, c.first_name, c.last_name, c.registration_date
),
customer_segments AS (
    SELECT 
        *,
        CASE 
            WHEN lifetime_value >= 10000 THEN 'VIP'
            WHEN lifetime_value >= 5000 THEN 'Gold'
            WHEN lifetime_value >= 1000 THEN 'Silver'
            ELSE 'Bronze'
        END as customer_segment,
        EXTRACT(days FROM CURRENT_DATE - last_order_date) as days_since_last_order
    FROM customer_purchases
)
SELECT 
    customer_segment,
    COUNT(*) as customer_count,
    ROUND(AVG(lifetime_value)::numeric, 2) as avg_clv,
    ROUND(AVG(total_orders)::numeric, 1) as avg_orders,
    ROUND(AVG(avg_order_value)::numeric, 2) as avg_order_size
FROM customer_segments
GROUP BY customer_segment
ORDER BY avg_clv DESC;

-- 2. Monthly Revenue Trend with Year-over-Year Comparison
WITH monthly_revenue AS (
    SELECT 
        DATE_TRUNC('month', order_date) as month,
        SUM(total_amount) as revenue,
        COUNT(DISTINCT order_id) as order_count,
        COUNT(DISTINCT customer_id) as unique_customers
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATE_TRUNC('month', order_date)
),
revenue_comparison AS (
    SELECT 
        month,
        revenue,
        order_count,
        unique_customers,
        LAG(revenue, 12) OVER (ORDER BY month) as revenue_last_year,
        LAG(order_count, 12) OVER (ORDER BY month) as orders_last_year
    FROM monthly_revenue
)
SELECT 
    TO_CHAR(month, 'YYYY-MM') as month,
    revenue,
    order_count,
    unique_customers,
    ROUND(((revenue - revenue_last_year) / revenue_last_year * 100)::numeric, 1) as yoy_revenue_growth,
    ROUND(((order_count - orders_last_year) / orders_last_year * 100)::numeric, 1) as yoy_order_growth
FROM revenue_comparison
WHERE month >= CURRENT_DATE - INTERVAL '12 months'
ORDER BY month DESC;

-- 3. Product Performance Analysis
WITH product_sales AS (
    SELECT 
        p.product_id,
        p.product_name,
        p.category,
        COUNT(DISTINCT oi.order_id) as times_ordered,
        SUM(oi.quantity) as units_sold,
        SUM(oi.quantity * oi.unit_price) as total_revenue,
        AVG(oi.unit_price) as avg_selling_price
    FROM products p
    JOIN order_items oi ON p.product_id = oi.product_id
    JOIN orders o ON oi.order_id = o.order_id
    WHERE o.status = 'completed'
        AND o.order_date >= CURRENT_DATE - INTERVAL '90 days'
    GROUP BY p.product_id, p.product_name, p.category
)
SELECT 
    category,
    product_name,
    units_sold,
    total_revenue,
    ROUND((total_revenue / SUM(total_revenue) OVER () * 100)::numeric, 2) as revenue_percentage,
    RANK() OVER (PARTITION BY category ORDER BY total_revenue DESC) as category_rank
FROM product_sales
WHERE total_revenue > 0
ORDER BY total_revenue DESC
LIMIT 20;

-- 4. Customer Churn Analysis
WITH customer_activity AS (
    SELECT 
        customer_id,
        MAX(order_date) as last_order_date,
        COUNT(order_id) as total_orders,
        CASE 
            WHEN MAX(order_date) < CURRENT_DATE - INTERVAL '180 days' THEN 'Churned'
            WHEN MAX(order_date) < CURRENT_DATE - INTERVAL '90 days' THEN 'At Risk'
            WHEN MAX(order_date) < CURRENT_DATE - INTERVAL '30 days' THEN 'Active'
            ELSE 'Recent'
        END as customer_status
    FROM orders
    WHERE status = 'completed'
    GROUP BY customer_id
)
SELECT 
    customer_status,
    COUNT(*) as customer_count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage,
    ROUND(AVG(total_orders)::numeric, 1) as avg_orders_per_customer
FROM customer_activity
GROUP BY customer_status
ORDER BY 
    CASE customer_status
        WHEN 'Recent' THEN 1
        WHEN 'Active' THEN 2
        WHEN 'At Risk' THEN 3
        WHEN 'Churned' THEN 4
    END;

-- 5. Cohort Retention Analysis
WITH cohorts AS (
    SELECT 
        c.customer_id,
        DATE_TRUNC('month', c.registration_date) as cohort_month,
        DATE_TRUNC('month', o.order_date) as order_month
    FROM customers c
    JOIN orders o ON c.customer_id = o.customer_id
    WHERE o.status = 'completed'
),
cohort_data AS (
    SELECT 
        cohort_month,
        order_month,
        COUNT(DISTINCT customer_id) as customers
    FROM cohorts
    GROUP BY cohort_month, order_month
),
cohort_size AS (
    SELECT 
        cohort_month,
        customers as cohort_size
    FROM cohort_data
    WHERE cohort_month = order_month
)
SELECT 
    cd.cohort_month,
    EXTRACT(months FROM age(cd.order_month, cd.cohort_month)) as months_since_registration,
    cd.customers,
    cs.cohort_size,
    ROUND((cd.customers::numeric / cs.cohort_size * 100), 2) as retention_rate
FROM cohort_data cd
JOIN cohort_size cs ON cd.cohort_month = cs.cohort_month
WHERE cd.cohort_month >= CURRENT_DATE - INTERVAL '12 months'
ORDER BY cd.cohort_month, months_since_registration;