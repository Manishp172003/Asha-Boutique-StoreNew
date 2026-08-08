import { useApp } from "../../../../context/AppContext";
import {
  PackageCheck,
  Package,
  Truck,
  MapPinned,
  Home,
} from "lucide-react";
import "./OrderTimeline.css";

const OrderTimeline = () => {
  const { orders } = useApp();

  // Get the latest order for timeline
  const latestOrder = orders.length > 0 ? orders[0] : null;

  // Define timeline steps with their icons
  const timelineSteps = [
    {
      status: 'confirmed',
      title: "Order Placed",
      icon: PackageCheck,
    },
    {
      status: 'processing',
      title: "Processing",
      icon: Package,
    },
    {
      status: 'shipped',
      title: "Shipped",
      icon: Truck,
    },
    {
      status: 'out_for_delivery',
      title: "Out for Delivery",
      icon: MapPinned,
    },
    {
      status: 'delivered',
      title: "Delivered",
      icon: Home,
    },
  ];

  // Generate timeline from order tracking data
  const generateTimeline = () => {
    if (!latestOrder) return [];

    const statusOrder = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIndex = statusOrder.indexOf(latestOrder.status);

    return timelineSteps.map((step, index) => {
      const isCompleted = index <= currentIndex;
      const trackingStep = latestOrder.tracking?.find(t => t.status === step.status);
      
      return {
        ...step,
        completed: isCompleted,
        date: trackingStep?.timestamp 
          ? new Date(trackingStep.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : (isCompleted && index === 0 ? new Date(latestOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Expected'),
      };
    });
  };

  const timeline = generateTimeline();

  if (!latestOrder) {
    return (
      <section className="timeline-card">
        <div className="timeline-header">
          <h2>Order Timeline</h2>
          <p>Track your latest order</p>
        </div>

        <div className="empty-state">
          <h3>No orders to track</h3>
          <p>Place an order to see your delivery timeline here.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="timeline-card">
      <div className="timeline-header">
        <h2>Order Timeline</h2>
        <p>Track your latest order</p>
      </div>

      <div className="timeline">
        {timeline.map((step, index) => {
          const Icon = step.icon;

          return (
            <div className="timeline-item" key={index}>

              <div
                className={`timeline-icon ${
                  step.completed ? "completed" : ""
                }`}
              >
                <Icon size={18} />
              </div>

              <div className="timeline-content">
                <h4>{step.title}</h4>
                <span>{step.date}</span>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};

export default OrderTimeline;