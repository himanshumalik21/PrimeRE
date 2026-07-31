<?php
$status = "error";
$message_text = "Invalid request method.";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize user inputs
    $name = strip_tags(trim($_POST["name"] ?? ''));
    $phone = strip_tags(trim($_POST["phone"] ?? ''));
    $email = filter_var(trim($_POST["email"] ?? ''), FILTER_SANITIZE_EMAIL);
    $division = strip_tags(trim($_POST["division"] ?? ''));
    $message = htmlspecialchars(trim($_POST["message"] ?? ''));

    // Validate fields
    if (empty($name) || empty($phone) || empty($email) || empty($message) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $status = "error";
        $message_text = "Please ensure all required fields are filled out correctly with a valid email address.";
    } else {
        // Email Configuration
        $to = "partners@theprimerealestates.com";
        $subject = "New Property Enquiry: " . $division;
        
        $email_content = "You have received a new property enquiry from your website:\n\n";
        $email_content .= "Name: $name\n";
        $email_content .= "Phone: $phone\n";
        $email_content .= "Email: $email\n";
        $email_content .= "Asset Division: $division\n\n";
        $email_content .= "Message/Requirement:\n$message\n";

        // Headers
        $headers = "From: Prime Real Estates Website <noreply@theprimerealestates.com>\r\n";
        $headers .= "Reply-To: $email\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();

        // Send Email
        if (mail($to, $subject, $email_content, $headers)) {
            $status = "success";
            $message_text = "Thank you, $name. Your enquiry has been successfully delivered to our partners. We will get in touch with you shortly.";
        } else {
            $status = "error";
            $message_text = "We encountered a technical issue while sending your message. Please reach out to us directly at partners@theprimerealestates.com or call +91 9818926580.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo ($status == 'success') ? 'Enquiry Submitted' : 'Submission Error'; ?> | Prime Real Estates</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-800 font-sans antialiased flex items-center justify-center min-h-screen p-4">
    <div class="max-w-md w-full bg-white border border-slate-200 p-8 rounded-2xl shadow-xl text-center">
        <?php if ($status == "success"): ?>
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">✓</div>
            <h1 class="text-2xl font-bold text-slate-900 mb-3">Enquiry Sent!</h1>
            <p class="text-slate-600 text-sm leading-relaxed mb-8"><?php echo $message_text; ?></p>
        <?php else: ?>
            <div class="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6">✕</div>
            <h1 class="text-2xl font-bold text-slate-900 mb-3">Unable to Send</h1>
            <p class="text-slate-600 text-sm leading-relaxed mb-8"><?php echo $message_text; ?></p>
        <?php endif; ?>
        
        <div class="space-y-3">
            <a href="contact.html" class="block w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition shadow">Back to Contact Page</a>
            <a href="index.html" class="block w-full bg-slate-100 text-slate-700 font-semibold py-3 rounded-xl hover:bg-slate-200 transition">Return to Home</a>
        </div>
    </div>
</body>
</html>