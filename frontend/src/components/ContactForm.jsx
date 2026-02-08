import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, User, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { toast } from '../hooks/use-toast';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [captcha, setCaptcha] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Generate simple math captcha
  React.useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptcha(`${num1} + ${num2}`);
    setCaptchaAnswer((num1 + num2).toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate captcha
    const userAnswer = document.getElementById('captcha-input').value;
    if (userAnswer !== captchaAnswer) {
      toast({
        title: "Captcha Failed",
        description: "Please solve the math problem correctly.",
        variant: "destructive"
      });
      generateCaptcha();
      return;
    }

    setIsSubmitting(true);

    // Simulate API call (will be replaced with real backend)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "Thank you for reaching out. I'll get back to you soon.",
      });
      
      // Reset form
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' });
        setSubmitted(false);
        generateCaptcha();
      }, 3000);
    }, 2000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <Card className="bg-[#1a1f3a]/50 backdrop-blur-lg border-[#2a3150] p-8">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <CheckCircle className="mx-auto text-[#10b981] mb-4" size={64} />
            <h3 className="text-2xl font-bold text-[#e5e7eb] mb-2">Message Sent!</h3>
            <p className="text-[#9ca3af]">Thank you for reaching out. I'll respond soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                <User size={16} className="inline mr-2" />
                Name
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                className="bg-[#0a0e27]/50 border-[#2a3150] text-[#e5e7eb] focus:border-[#00d4ff] transition-colors"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                <Mail size={16} className="inline mr-2" />
                Email
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                className="bg-[#0a0e27]/50 border-[#2a3150] text-[#e5e7eb] focus:border-[#00d4ff] transition-colors"
              />
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                <MessageSquare size={16} className="inline mr-2" />
                Message
              </label>
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="Tell me about your project or inquiry..."
                className="bg-[#0a0e27]/50 border-[#2a3150] text-[#e5e7eb] focus:border-[#00d4ff] transition-colors resize-none"
              />
            </div>

            {/* Captcha */}
            <div>
              <label className="block text-sm font-medium text-[#9ca3af] mb-2">
                Security Check: What is {captcha}?
              </label>
              <Input
                type="text"
                id="captcha-input"
                required
                placeholder="Enter the answer"
                className="bg-[#0a0e27]/50 border-[#2a3150] text-[#e5e7eb] focus:border-[#00d4ff] transition-colors"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00d4ff] hover:bg-[#0ea5e9] text-[#0a0e27] font-semibold transition-all"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2">⟳</span>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        )}
      </Card>
    </motion.div>
  );
};

export default ContactForm;