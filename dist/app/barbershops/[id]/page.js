import PhoneItem from "@/app/_components/phone-item";
import ServiceItem from "@/app/_components/service-item";
import SidebarSheet from "@/app/_components/sidebar-sheet";
import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet";
import { db } from "@/app/_lib/prisma";
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RatingClientSide from "../../_components/rating-client-side";
import RatingDisplay from "@/app/_components/rating-display";
const BarbershopPage = async ({ params }) => {
    const barbershop = await db.barbershop.findUnique({
        where: {
            id: params.id,
        },
        include: {
            services: true,
            ratings: true, // Inclua as avaliações
        },
    });
    if (!barbershop) {
        return notFound();
    }
    // Calcular a média das avaliações
    const calculateAverageRating = () => {
        if (barbershop.ratings.length === 0)
            return 0;
        const totalRating = barbershop.ratings.reduce((sum, rating) => sum + rating.rating, 0);
        return (totalRating / barbershop.ratings.length).toFixed(1); // Mantém uma casa decimal
    };
    // Obter o número total de avaliações
    const totalRatings = barbershop.ratings.length;
    return (<div>
      {/* IMAGEM */}
      <div className="relative h-[250px] w-full lg:min-h-96">
        <Image alt={barbershop.name} src={barbershop?.imageUrl || "/default-image.png"} // Caminho padrão para imagem
     fill className="object-cover lg:object-fill"/>

        <Button size="icon" variant="secondary" className="absolute left-4 top-4" asChild>
          <Link href="/">
            <ChevronLeftIcon />
          </Link>
        </Button>

        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="absolute right-4 top-4">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </div>

      {/* TÍTULO */}
      <div className="flex justify-between border-b border-solid p-5">
        <div className="flex flex-col">
          <h1 className="mb-3 text-xl font-bold">{barbershop.name}</h1>
          <div className="mb-2 flex items-center gap-2">
            <MapPinIcon className="text-primary" size={18}/>
            <p className="text-sm">{barbershop?.address}</p>
          </div>

          <div className="flex items-center gap-2">
            <StarIcon className="fill-primary text-primary" size={18}/>
            <p className="text-sm">
              {calculateAverageRating()} ({totalRatings} avaliações)
            </p>
          </div>
        </div>
        {/* BOTÃO DE AVALIAÇÃO */}
        <RatingClientSide barbershop={barbershop}/>
      </div>

      {/* DESCRIÇÃO */}
      <div className="space-y-2 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Sobre nós</h2>
        <p className="text-justify text-sm">{barbershop?.description}</p>
      </div>

      {/* SERVIÇOS */}
      <div className="space-y-3 border-b border-solid p-5">
        <h2 className="text-xs font-bold uppercase text-gray-400">Serviços</h2>
        <div className="space-y-3">
          {barbershop.services.map((service) => (<ServiceItem key={service.id} barbershop={JSON.parse(JSON.stringify(barbershop))} service={JSON.parse(JSON.stringify(service))}/>))}
        </div>
      </div>

      {/* CONTATO */}
      <div className="space-y-3 p-5">
        {barbershop.phones.map((phone) => (<PhoneItem key={phone} phone={phone}/>))}
      </div>

      {/* EXIBIÇÃO DE AVALIAÇÕES */}
      <RatingDisplay ratings={barbershop.ratings} services={barbershop.services}/>
    </div>);
};
export default BarbershopPage;
