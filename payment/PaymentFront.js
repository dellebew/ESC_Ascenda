import 'gestalt';
import 'gestalt/dist/gestalt.css';

console.log("PaymentFRont.jsx");
function PaymentFront() { 
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef();
  
    React.useEffect(() => {
      setOpen(true)
    }, []);
  
    return (
      <ScrollBoundaryContainer height={200}>
        <Box padding={4} width={600}>
          <Flex gap={4}>
            <Box width={200}>
                <Text>
                    You need to add your data source URL to Pinterest so we can access your data source file and create Pins for your products. Before you do this, make sure you have prepared your data source and that you have claimed your website. If there are any errors with your data source file, you can learn how to troubleshoot them below. After you click Create Pins, you'll land back at the main data source page while your feed is being processed. Wait for a confirmation email from Pinterest about the status of your data source submission.
                </Text>
                <p>Property Location: The Forest by Wangz is in the heart of Singapore, walking distance from Tan Tock Seng Hospital and United Square Mall.  This 4-star aparthotel is close to National Orchid Garden and Chinatown Heritage Center.</p><p><b>Rooms</b> <br />Make yourself at home in one of the 38 individually furnished guestrooms, featuring kitchenettes with refrigerators and stovetops. Wired and wireless Internet access is complimentary, while 40-inch LED televisions and DVD players provide entertainment. Conveniences include safes and desks, as well as phones with free local calls.</p><p><b>Amenities</b> <br />Be sure to enjoy recreational amenities including an outdoor pool and a fitness center. Additional amenities include complimentary wireless Internet access, concierge services, and barbecue grills.</p><p><b>Dining</b> <br />A complimentary breakfast is included.</p><p><b>Business, Other Amenities</b> <br />Featured amenities include complimentary newspapers in the lobby, a 24-hour front desk, and luggage storage. Free self parking is available onsite.</p>
            </Box>
            <Button
              ref={anchorRef}
              href="https://help.pinterest.com/en/business/article/data-source-ingestion"
              iconEnd="visit"
              onClick={() => setOpen(false)}
              role="link"
              target="blank"
              text="Help"
            />
            <form action="/create-checkout-session" method="POST">
                <Button type="submit" id="checkout-button">Checkout</Button>
            </form>
            {open && (
              <Layer>
                <Popover
                  anchor={anchorRef.current}
                  color="blue"
                  idealDirection="right"
                  onDismiss={() => {}}
                  positionRelativeToAnchor={false}
                  showCaret
                  size="xs"
                >
                  <Box
                    padding={3}
                    display="flex"
                    alignItems="center"
                    direction="column"
                    column={12}
                  >
                    <form action="/create-checkout-session" method="POST">
                        <button type="submit" id="checkout-button">Checkout</button>
                    </form>
                  </Box>
                </Popover>
              </Layer>
            )}
          </Flex>
        </Box>
      </ScrollBoundaryContainer>
  )}