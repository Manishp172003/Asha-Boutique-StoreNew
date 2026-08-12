import { useState } from 'react'
import { Instagram, Facebook, Mail, Sparkles, Copy, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { subscribeToNewsletter } from '../../services/newsletterService'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    // Strict email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      await subscribeToNewsletter(trimmedEmail)
      setEmail('')
      setModalOpen(true)
    } catch (err) {
      toast.error(err.message || 'Subscription failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText('WELCOME10')
    setCopied(true)
    toast.success('Coupon code copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <footer className="py-16 px-5 lg:px-12 bg-[#2B1E1A] text-[#F6F2EE]">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Newsletter */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-2xl font-semibold mb-4 text-left">
              Get the lookbook in your inbox.
            </h3>
            <form onSubmit={handleSubscribe} className="flex flex-wrap gap-3">
              <Input 
                type="email" 
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-full px-6 max-w-xs focus:outline-none focus:border-[#E46A53]"
              />
              <Button 
                type="submit"
                disabled={loading || !email.trim()}
                className="bg-[#E46A53] hover:bg-[#d55a43] disabled:opacity-50 text-white rounded-full px-6 transition-all"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h4 className="font-medium mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/shop" className="text-white/70 hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/lookbook" className="text-white/70 hover:text-white transition-colors">Lookbook</Link></li>
              <li><Link to="/atelier" className="text-white/70 hover:text-white transition-colors">Atelier</Link></li>
              <li><Link to="/" className="text-white/70 hover:text-white transition-colors">Visit</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-left">
            <h4 className="font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-white/70">
              <li>+91 97 6790 7469</li>
              <li>hello@ashaboutique.com</li>
              <li>Maharashtra Nagpur, India</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10">
          <div className="flex gap-4 w-24 justify-start">
            <button className="text-white/70 hover:text-white transition-colors">
              <Instagram size={20} />
            </button>
            <button className="text-white/70 hover:text-white transition-colors">
              <Facebook size={20} />
            </button>
            <button className="text-white/70 hover:text-white transition-colors">
              <Mail size={20} />
            </button>
          </div>

          <p className="text-white/50 text-sm text-center flex-1">
            © 2026 Asha Boutique Store. Crafted in Nagpur. | <Link to="/admin" className="hover:text-white transition-colors text-white/40">Staff Portal</Link>
          </p>

          <div className="hidden md:block w-24"></div>
        </div>
      </div>

      {/* Subscription Welcome Dialog Reward Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#F6F2EE] border-none rounded-[22px]">
          <div className="flex flex-col items-center text-center py-6">
            <div className="w-16 h-16 bg-[#E46A53]/10 text-[#E46A53] rounded-full flex items-center justify-center mb-4">
              <Sparkles size={32} />
            </div>
            
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-[#2B1E1A] text-center">
                Welcome to our Community!
              </DialogTitle>
              <DialogDescription className="text-[#7A655D] text-center mt-1">
                You've successfully subscribed to our curated newsletters. As a special gift, here is your welcome promo code:
              </DialogDescription>
            </DialogHeader>

            <div className="w-full mt-6 bg-white border border-[#E9E3DD] rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-[#7A655D] uppercase tracking-wider font-semibold">Promo Code</span>
                <span className="font-mono text-xl font-bold text-[#2B1E1A] tracking-widest">WELCOME10</span>
              </div>
              <button
                onClick={handleCopyCode}
                className="bg-[#2B1E1A] hover:bg-[#E46A53] text-white p-3 rounded-xl transition-all flex items-center justify-center gap-1.5"
                title="Copy Coupon Code"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </button>
            </div>

            <p className="text-[11px] text-[#7A655D]/70 mt-3 italic">
              * Valid for 10% off your next purchase of ₹500 or more.
            </p>

            <Button
              onClick={() => setModalOpen(false)}
              className="mt-6 w-full bg-[#E46A53] hover:bg-[#d55a43] text-white rounded-full py-5"
            >
              Start Exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </footer>
  )
}

export default Footer
