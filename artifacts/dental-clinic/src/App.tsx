import React, { useState, useEffect } from "react";
import { useInView } from "./hooks/use-in-view";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import useEmblaCarousel from "embla-carousel-react";
import { CalendarIcon, MapPin, Phone, MessageCircle, ChevronDown, CheckCircle2, Clock, Menu, X, Star } from "lucide-react";
import { Sparkles, Smile, Crown, Stethoscope, Baby, HeartPulse } from "lucide-react";
import { FaWhatsapp, FaInstagram, FaSnapchatGhost, FaTiktok } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Import assets
import heroBg from "@/assets/hero-bg.png";
import aboutClinic from "@/assets/about-clinic.png";
import doctor1 from "@/assets/doctor-1.png";
import doctor2 from "@/assets/doctor-2.png";
import doctor3 from "@/assets/doctor-3.png";
import beforeImg from "@/assets/before.png";
import afterImg from "@/assets/after.png";
import gallery1 from "@/assets/gallery-1.png";
import gallery2 from "@/assets/gallery-2.png";
import gallery3 from "@/assets/gallery-3.png";

const bookingSchema = z.object({
  fullName: z.string().min(3, { message: "الاسم الكامل مطلوب" }),
  phone: z.string().min(10, { message: "رقم الجوال غير صحيح" }),
  service: z.string().min(1, { message: "الرجاء اختيار الخدمة" }),
  date: z.date({ required_error: "الرجاء اختيار التاريخ" }),
  time: z.string().min(1, { message: "الرجاء اختيار الوقت" }),
  notes: z.string().optional(),
});

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, isInView] = useInView({ threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Counter({ end, suffix = "", duration = 2000 }: { end: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const [ref, isInView] = useInView();

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return (
    <div ref={ref} className="text-4xl font-bold text-primary flex items-center justify-center">
      <span>{suffix}</span>
      <span>{count}</span>
    </div>
  );
}

export default function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, direction: "rtl" });

  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);
    const onPointerDown = () => clearInterval(interval);
    emblaApi.on("pointerDown", onPointerDown);
    return () => {
      clearInterval(interval);
      emblaApi.off("pointerDown", onPointerDown);
    };
  }, [emblaApi]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const form = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      service: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof bookingSchema>) {
    console.log(values);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      form.reset();
    }, 5000);
  }

  const handleDrag = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const slider = document.getElementById("before-after-slider");
    if (slider) {
      const rect = slider.getBoundingClientRect();
      // RTL context means 0 is right, 100 is left visually, but clientX is from left
      const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      setSliderPosition(percent);
    }
  };

  useEffect(() => {
    if (!isDragging) return;
    const stopDragging = () => setIsDragging(false);
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", stopDragging);
    window.addEventListener("touchmove", handleDrag);
    window.addEventListener("touchend", stopDragging);
    return () => {
      window.removeEventListener("mousemove", handleDrag);
      window.removeEventListener("mouseup", stopDragging);
      window.removeEventListener("touchmove", handleDrag);
      window.removeEventListener("touchend", stopDragging);
    };
  }, [isDragging]);

  const navLinks = [
    { name: "الرئيسية", href: "#home" },
    { name: "خدماتنا", href: "#services" },
    { name: "من نحن", href: "#about" },
    { name: "أطباؤنا", href: "#doctors" },
    { name: "احجز موعد", href: "#booking" },
    { name: "اتصل بنا", href: "#contact" },
  ];

  const services = [
    { id: "implant", name: "زراعة الأسنان", icon: <Crown size={32} />, desc: "استعد ابتسامتك ووظيفة أسنانك بثقة تامة" },
    { id: "hollywood", name: "هوليود سمايل", icon: <Sparkles size={32} />, desc: "ابتسامة مثالية ومشرقة تخطف الأنظار" },
    { id: "braces", name: "تقويم الأسنان", icon: <Smile size={32} />, desc: "أحدث التقنيات لصف أسنان متناسق" },
    { id: "whitening", name: "تبييض الأسنان", icon: <Stethoscope size={32} />, desc: "أسنان ناصعة البياض في جلسة واحدة" },
    { id: "root", name: "علاج الجذور", icon: <HeartPulse size={32} />, desc: "علاج دقيق ومريح بأحدث الأجهزة" },
    { id: "pediatric", name: "أسنان الأطفال", icon: <Baby size={32} />, desc: "رعاية لطيفة ومخصصة لأحبائنا الصغار" },
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground w-full overflow-x-hidden">
      
      {/* Floating Contact Bar */}
      <div className="hidden md:flex justify-between items-center bg-primary text-primary-foreground py-2 px-6 text-sm font-medium z-50 relative">
        <div className="flex items-center gap-6">
          <a href="tel:+966501234567" className="flex items-center gap-2 hover:text-accent transition-colors" data-testid="link-top-phone">
            <Phone size={16} />
            <span dir="ltr">+966 50 123 4567</span>
          </a>
          <a href="https://wa.me/966501234567" className="flex items-center gap-2 hover:text-accent transition-colors" data-testid="link-top-whatsapp">
            <FaWhatsapp size={16} />
            <span>واتساب المباشر</span>
          </a>
          <a href="https://maps.google.com/?q=Riyadh,Saudi+Arabia" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-accent transition-colors" data-testid="link-top-map">
            <MapPin size={16} />
            <span>الموقع الجغرافي</span>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>السبت - الخميس: 9:00 ص - 9:00 م</span>
        </div>
      </div>

      {/* Sticky Navbar */}
      <header 
        className={`sticky top-0 w-full z-40 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-4" : "bg-white py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <a href="#home" className="text-2xl font-bold text-accent tracking-tight">
            عيادة النخبة للأسنان
          </a>
          
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href}
                className="text-foreground hover:text-primary font-semibold transition-colors"
                data-testid={`link-nav-${link.href.slice(1)}`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden bg-white border-b"
            >
              <div className="flex flex-col py-4 px-6 space-y-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={link.href}
                    className="text-foreground font-medium py-2 border-b border-border/50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.name}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-[90vh] flex items-center pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroBg} 
            alt="صالة الانتظار وعيادة الأسنان" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold text-foreground leading-tight mb-6"
            >
              ابتسامتك <span className="text-primary">المثالية</span><br /> تبدأ معنا
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-slate-700 mb-8 leading-relaxed"
            >
              نقدم رعاية طبية متقدمة في بيئة هادئة وفاخرة. خبرة تمتد لأكثر من ١٥ عاماً في خدمة أكثر من ٥٠٠٠ عميل سعيد.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg h-14 px-8 rounded-full shadow-lg" asChild data-testid="button-hero-book">
                <a href="#booking">احجز موعد الآن</a>
              </Button>
              <Button size="lg" variant="outline" className="border-accent text-accent hover:bg-accent/10 text-lg h-14 px-8 rounded-full" asChild data-testid="button-hero-call">
                <a href="tel:+966501234567">اتصل بنا</a>
              </Button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
              className="mt-12 flex flex-wrap gap-3"
            >
              {["+١٥ سنة خبرة", "+٥٠٠٠ عميل سعيد", "أحدث تقنيات الأسنان"].map((badge, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-sm border border-white/40 shadow-sm px-4 py-2 rounded-full text-sm font-bold text-primary flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-accent" />
                  {badge}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">خدماتنا المتميزة</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <AnimatedSection key={service.id} className="h-full">
                <Card className="h-full border-transparent bg-white shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center text-4xl mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{service.name}</h3>
                    <p className="text-slate-600 mb-6">{service.desc}</p>
                    <a href="#booking" className="mt-auto font-bold text-primary hover:text-accent transition-colors inline-flex items-center gap-2">
                      اعرف المزيد
                    </a>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-white overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <AnimatedSection className="lg:w-1/2 w-full order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-4 bg-secondary/50 rounded-[2rem] transform rotate-3 -z-10"></div>
                <img 
                  src={aboutClinic} 
                  alt="عيادة النخبة من الداخل" 
                  className="w-full rounded-[2rem] shadow-xl object-cover aspect-[4/3]"
                />
              </div>
            </AnimatedSection>
            
            <AnimatedSection className="lg:w-1/2 w-full order-1 lg:order-2">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">من نحن</h2>
              <div className="w-16 h-1 bg-accent mb-8 rounded-full"></div>
              
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                في عيادة النخبة للأسنان، نؤمن بأن الابتسامة الجميلة هي مفتاح الثقة بالنفس. تأسست عيادتنا لتقديم مستوى استثنائي من الرعاية في بيئة فندقية فاخرة تضمن راحة المراجعين.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed mb-10">
                نستخدم أحدث ما توصلت إليه التكنولوجيا العالمية في طب الأسنان، مع فريق طبي من الاستشاريين والأخصائيين ذوي الخبرة العالية لضمان نتائج مبهرة ومستدامة.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <Counter end={15} suffix="+" />
                  <p className="text-center text-slate-600 font-semibold mt-2">سنة خبرة</p>
                </div>
                <div>
                  <Counter end={5000} suffix="+" />
                  <p className="text-center text-slate-600 font-semibold mt-2">عميل سعيد</p>
                </div>
                <div>
                  <Counter end={20} suffix="+" />
                  <p className="text-center text-slate-600 font-semibold mt-2">طبيب متخصص</p>
                </div>
                <div>
                  <Counter end={98} suffix="%" />
                  <p className="text-center text-slate-600 font-semibold mt-2">نسبة الرضا</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Doctors Section */}
      <section id="doctors" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">فريقنا الطبي</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
              نخبة من أمهر أطباء واستشاريي الأسنان لضمان تقديم أفضل رعاية طبية وتجميلية
            </p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "د. أحمد الزهراني", title: "متخصص زراعة الأسنان", exp: "١٢ سنة خبرة", img: doctor1 },
              { name: "د. سارة المالكي", title: "متخصصة تجميل الأسنان", exp: "١٠ سنوات خبرة", img: doctor2 },
              { name: "د. محمد العمري", title: "متخصص تقويم الأسنان", exp: "٨ سنوات خبرة", img: doctor3 },
            ].map((doc, i) => (
              <AnimatedSection key={i}>
                <Card className="overflow-hidden border-transparent hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img 
                      src={doc.img} 
                      alt={doc.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                        احجز مع {doc.name.split(' ')[1]}
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-6 text-center bg-white">
                    <h3 className="text-2xl font-bold mb-2 text-foreground">{doc.name}</h3>
                    <p className="text-primary font-semibold mb-2">{doc.title}</p>
                    <p className="text-slate-500 text-sm">{doc.exp}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Before & After Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">نتائج مذهلة</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">قبل وبعد تجميل الأسنان</p>
          </AnimatedSection>

          <AnimatedSection className="max-w-4xl mx-auto mb-16">
            <div 
              id="before-after-slider"
              className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl select-none"
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            >
              {/* After image (background) */}
              <img src={afterImg} alt="بعد العلاج" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              
              {/* Before image (foreground clip) */}
              <div 
                className="absolute inset-0 w-full h-full"
                style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }} // RTL visual fix
              >
                <img src={beforeImg} alt="قبل العلاج" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
              </div>
              
              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center z-10"
                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
              >
                <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center -ml-5 text-primary">
                  <div className="flex gap-1">
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-r-[6px] border-r-primary border-b-4 border-b-transparent"></div>
                    <div className="w-0 h-0 border-t-4 border-t-transparent border-l-[6px] border-l-primary border-b-4 border-b-transparent"></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">بعد</div>
              <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">قبل</div>
            </div>
          </AnimatedSection>
          
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <img src={gallery1} alt="نتيجة 1" className="w-full rounded-2xl aspect-square object-cover shadow-md hover:scale-[1.02] transition-transform" />
              <img src={gallery2} alt="نتيجة 2" className="w-full rounded-2xl aspect-square object-cover shadow-md hover:scale-[1.02] transition-transform" />
              <img src={gallery3} alt="نتيجة 3" className="w-full rounded-2xl aspect-square object-cover shadow-md hover:scale-[1.02] transition-transform" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto">
            <AnimatedSection className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">احجز موعدك الآن</h2>
              <p className="text-secondary text-lg">سجل بياناتك وسنقوم بالتواصل معك لتأكيد الموعد</p>
            </AnimatedSection>
            
            <AnimatedSection>
              <Card className="border-0 shadow-2xl overflow-hidden rounded-3xl">
                <CardContent className="p-8 md:p-12">
                  {isSuccess ? (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 text-center space-y-6"
                    >
                      <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={48} className="text-primary" />
                      </div>
                      <h3 className="text-3xl font-bold text-foreground">تم تأكيد حجزك بنجاح!</h3>
                      <p className="text-xl text-slate-600">سنتواصل معك قريباً لتأكيد الموعد النهائي.</p>
                      <Button onClick={() => setIsSuccess(false)} variant="outline" className="mt-8 rounded-full px-8">حجز موعد آخر</Button>
                    </motion.div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-bold">الاسم الكامل</FormLabel>
                                <FormControl>
                                  <Input placeholder="أدخل اسمك الكامل" className="h-14 rounded-xl bg-slate-50 border-transparent focus-visible:ring-primary focus-visible:ring-offset-2" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-bold">رقم الجوال</FormLabel>
                                <FormControl>
                                  <Input placeholder="05x xxx xxxx" dir="ltr" className="h-14 rounded-xl bg-slate-50 border-transparent focus-visible:ring-primary focus-visible:ring-offset-2 text-right" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="service"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-bold">اختر الخدمة</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-14 rounded-xl bg-slate-50 border-transparent focus:ring-primary">
                                      <SelectValue placeholder="اختر الخدمة المطلوبة" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent dir="rtl">
                                    {services.map(s => (
                                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-base font-bold mt-1">تاريخ الموعد</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={`h-14 rounded-xl bg-slate-50 border-transparent w-full pl-3 text-right font-normal flex justify-between items-center ${!field.value && "text-muted-foreground"}`}
                                      >
                                        {field.value ? format(field.value, "PPP", { locale: ar }) : <span>اختر التاريخ</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) => date < new Date() || date.getDay() === 5} // Disable past dates and Fridays
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-base font-bold">وقت الموعد</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger className="h-14 rounded-xl bg-slate-50 border-transparent focus:ring-primary">
                                      <SelectValue placeholder="الفترة المفضلة" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent dir="rtl">
                                    <SelectItem value="morning">الصباح (9:00 ص - 12:00 م)</SelectItem>
                                    <SelectItem value="afternoon">الظهر (1:00 م - 4:00 م)</SelectItem>
                                    <SelectItem value="evening">المساء (5:00 م - 9:00 م)</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel className="text-base font-bold">ملاحظات إضافية (اختياري)</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="أي تفاصيل أخرى تود إضافتها..." 
                                    className="resize-none min-h-[100px] rounded-xl bg-slate-50 border-transparent focus-visible:ring-primary"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <Button type="submit" className="w-full h-16 text-xl font-bold bg-gradient-to-r from-primary to-teal-800 hover:from-primary hover:to-primary text-white rounded-xl shadow-lg shadow-primary/30 mt-4" data-testid="button-submit-booking">
                          تأكيد الحجز
                        </Button>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">آراء عملائنا</h2>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="embla overflow-hidden" ref={emblaRef} dir="rtl">
              <div className="embla__container flex">
                {[
                  { name: "خالد العتيبي", text: "تجربة رائعة جداً، عيادة فخمة وتعامل راقي من جميع الكادر. دكتور أحمد يده خفيفة جداً في الزراعة ولم أشعر بأي ألم." },
                  { name: "نورة الدوسري", text: "سويت هوليود سمايل عند الدكتورة سارة والنتيجة خيال! غيرت ابتسامتي وثقتي بنفسي. شكراً لعيادة النخبة." },
                  { name: "عبدالله الشمري", text: "أفضل عيادة أسنان زرتها في الرياض. اهتمام بالتفاصيل، نظافة عالية، ومواعيد دقيقة. أنصح بهم بشدة." },
                  { name: "ريم القحطاني", text: "عالجت أسنان أطفالي عندهم، العيادة مجهزة بشكل يكسر حاجز الخوف عند الأطفال. تجربة ممتازة." },
                  { name: "فهد المطيري", text: "تقويم الأسنان مع الدكتور محمد كان مريح وسريع، التقنيات المستخدمة حديثة جداً والنتيجة مبهرة." }
                ].map((testimonial, i) => (
                  <div key={i} className="embla__slide flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] pl-6">
                    <Card className="h-full bg-white/60 backdrop-blur-md border border-white/40 shadow-lg">
                      <CardContent className="p-8">
                        <div className="flex text-accent mb-6">
                          {[...Array(5)].map((_, j) => <Star key={j} size={20} fill="currentColor" />)}
                        </div>
                        <p className="text-slate-700 mb-8 leading-relaxed italic">"{testimonial.text}"</p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-primary font-bold text-xl">
                            {testimonial.name.charAt(0)}
                          </div>
                          <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ & Map Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-foreground mb-8">الأسئلة الشائعة</h2>
              <Accordion type="single" collapsible className="w-full">
                {[
                  { q: "هل تقبلون التأمين الطبي؟", a: "نعم، نقبل معظم شركات التأمين الطبي الكبرى في المملكة. يرجى التواصل معنا للتأكد من تغطية بوليصتك." },
                  { q: "كم تستغرق جلسة تبييض الأسنان؟", a: "تستغرق الجلسة تقريباً 45 إلى 60 دقيقة باستخدام أحدث تقنيات الليزر الآمنة، وتظهر النتائج فوراً." },
                  { q: "هل زراعة الأسنان مؤلمة؟", a: "نستخدم تزويقاً موضعياً متقدماً وتقنيات زراعة دقيقة جداً تجعل الإجراء شبه خالي من الألم تماماً." },
                  { q: "ما هي أوقات العمل في العيادة؟", a: "نعمل من السبت إلى الخميس، من الساعة 9:00 صباحاً وحتى 9:00 مساءً. الجمعة مغلق." },
                  { q: "هل توفرون خيارات تقسيط؟", a: "نعم، نوفر خطط دفع ميسرة وتقسيط بدون فوائد بالتعاون مع شركائنا الماليين." },
                  { q: "كم تدوم نتيجة هوليود سمايل؟", a: "مع العناية الجيدة والمتابعة الدورية، يمكن أن تدوم القشور الخزفية (الفينير) لأكثر من 15 عاماً." }
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b border-border py-2">
                    <AccordionTrigger className="text-lg font-bold text-right hover:text-primary hover:no-underline data-[state=open]:text-primary">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-600 leading-relaxed text-base">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimatedSection>

            <AnimatedSection>
              <h2 className="text-3xl font-bold text-foreground mb-8">موقعنا</h2>
              <Card className="border-0 shadow-xl overflow-hidden rounded-3xl h-[400px] relative">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3623.7!2d46.6753!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzEuMSJF!5e0!3m2!1sen!2ssa!4v1" 
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </Card>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="text-primary shrink-0 mt-1" />
                  <div>
                    <h4 className="font-bold text-lg">الرياض، حي العليا</h4>
                    <p className="text-slate-600">شارع العروبة، برج النخبة، الدور الثالث</p>
                    <p className="text-sm text-accent mt-1">بالقرب من برج المملكة</p>
                  </div>
                </div>
                <Button className="w-fit mt-2 rounded-full" asChild data-testid="button-google-maps">
                  <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer">
                    افتح الموقع في خرائط جوجل
                  </a>
                </Button>
              </div>
            </AnimatedSection>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            
            <div>
              <h3 className="text-2xl font-bold text-accent mb-6">عيادة النخبة للأسنان</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">
                رعاية طبية متقدمة في بيئة هادئة وفاخرة. التزامنا هو منحك الابتسامة التي تستحقها.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                  <FaInstagram size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                  <FaXTwitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                  <FaTiktok size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                  <FaSnapchatGhost size={18} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-b border-white/10 pb-4 inline-block">روابط سريعة</h4>
              <ul className="space-y-4">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className="text-slate-400 hover:text-accent transition-colors">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-b border-white/10 pb-4 inline-block">ساعات العمل</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="flex justify-between">
                  <span>السبت - الأربعاء</span>
                  <span>9:00 ص - 9:00 م</span>
                </li>
                <li className="flex justify-between">
                  <span>الخميس</span>
                  <span>9:00 ص - 6:00 م</span>
                </li>
                <li className="flex justify-between text-accent/80">
                  <span>الجمعة</span>
                  <span>مغلق</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-b border-white/10 pb-4 inline-block">تواصل معنا</h4>
              <ul className="space-y-4 text-slate-400">
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-accent shrink-0" />
                  <span dir="ltr">+966 50 123 4567</span>
                </li>
                <li className="flex items-center gap-3">
                  <FaWhatsapp size={18} className="text-accent shrink-0" />
                  <a href="https://wa.me/966501234567" className="hover:text-white">محادثة واتساب</a>
                </li>
                <li className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-accent shrink-0" />
                  <a href="mailto:info@elitedentalclinic.sa" className="hover:text-white">info@elitedentalclinic.sa</a>
                </li>
                <li className="flex items-start gap-3 mt-4">
                  <MapPin size={18} className="text-accent shrink-0 mt-1" />
                  <span>الرياض، حي العليا، شارع العروبة، برج النخبة</span>
                </li>
              </ul>
            </div>

          </div>
          
          <div className="border-t border-white/10 pt-8 text-center text-slate-500 text-sm">
            <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} لعيادة النخبة للأسنان</p>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      <a 
        href="https://wa.me/966501234567" 
        className="fixed bottom-6 left-6 w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 animate-bounce"
        style={{ animationDuration: '3s' }}
        data-testid="button-floating-whatsapp"
      >
        <FaWhatsapp size={32} />
      </a>

      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-border z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <Button className="w-full h-12 bg-primary rounded-full text-lg shadow-md" asChild>
          <a href="#booking">احجز موعد الآن</a>
        </Button>
      </div>

    </div>
  );
}